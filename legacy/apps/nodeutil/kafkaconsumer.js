const logger = require('./util/logger');
const Kafka = require('node-rdkafka');
const filepreview = require('./filepreview');
const unfurler = require('./unfurler');
const config = require('config');
const async = require('async');
const Unfurl = new unfurler();
const KAFKA_HOST = config.get('kafka_host');

logger.info("KAFKA BROKER = " +  KAFKA_HOST);

const host = require('./util/host');
const SERVER_HOST = host();
const client_id =  'nodeutil-' + SERVER_HOST;
logger.info("CLIENT ID = " +  client_id);

const consumer = new Kafka.KafkaConsumer({
    'group.id': 'nodeutilgroup',
    'metadata.broker.list': KAFKA_HOST,
    'client.id': client_id
}, {});


let mqProducer = null;
let paused = false;

class MQConsumer {
    /**
     * Initialize the Kafka consumer to listen for request and push to server
     * @param theSocketServer
     */

    initialize(mq) {

        mqProducer = mq;
        consumer.connect();

        // firebase init
        const firebaseAdmin = require('firebase-admin');
        const firebaseEnabled = process.env.FCM_ENABLED !== '0' && process.env.FCM_ENABLED !== 'false';
        if (firebaseEnabled) {
            const serviceAccount = require("/server/config/firebasepk.json");
            firebaseAdmin.initializeApp({
                credential: firebaseAdmin.credential.cert(serviceAccount)
            });
        }

        const taskLimit =  10;
        let taskCount = 0;
        consumer
            .on('ready', function() {
                consumer.subscribe(['as_node_util_queue']);

                // Consume from the as_node_util_queue topic.
                // No calback required. Will cause data event to be raised
                consumer.consume();
            })
            .on('data', function(message) {

                taskCount++;
                if (taskCount >= taskLimit) {
                    consumer.pause(consumer.assignments());
                    paused = true;
                }
                // Output the actual message contents
                const data = message.value.toString();
                //logger.info(data);

                try {
                    const dataObj = JSON.parse(data);
                    // Got a command. Process right here (blocking the queue is ok)
                    switch (dataObj.command) {

                        case 'unfurl_link':
                            processUnfurlCommand(dataObj);
                            break;
                        case 'create_file_preview':
                            logger.info("QUEUING " + dataObj);
                            convertDocument (dataObj);

                            break;
                        case 'fcm': // firebase cloud messaging
                            if (firebaseEnabled) {
                                sendFirebaseMessage(dataObj);
                            }
                            break;
                        case 'strip_message_from_email':
                            stripMessageFromEmail(dataObj);
                            break;
                        default:
                            logger.info(`Invalid command '${dataObj.command}'`);
                    }
                } catch (e) {
                    logger.error(e);
                }

                taskCount--;
                if (paused && (taskCount < taskLimit)) {
                    consumer.resume(consumer.assignments());
                    paused = false;
                }
            });

        const processUnfurlCommand = async function (dataObj) {

            try {
                logger.info("Unfurling: " + dataObj.payload.url);

                let normalizedResult = await Unfurl.processUnfurlCommand(dataObj);

                //logger.info(normalizedResult);
                if (normalizedResult.length != 0) {
                    normalizedResult['url'] = dataObj.payload.url;
                    // Create a message back:
                    let unfurledPayload = {
                        source: 'node_util',
                        command: 'unfurl_response',
                        host: 'localhost', //TODO: We shoudl probably send unique host name for HA cluster
                        message_id: dataObj.payload.message_id,
                        unfurl_result: normalizedResult
                    };

                    let msg = 'JSONRTMOBJ#' + JSON.stringify(unfurledPayload);
                    //logger.info("Publishing to MQ " + msg);

                    // Process and send it back via producer
                    mqProducer.publishToMQ(msg);
                }
            }
            catch(err) {
                // Nothing to do. Just ignore.
                logger.error(err);
                return;
            }
        };

        const convertDocument = async function (dataObj) {
            try {
                logger.info("Generating File Preview: " + dataObj.payload.url);
                let FilePreview = new filepreview();

                await FilePreview.generatePreview(dataObj.payload.url, dataObj.payload.name, (status) => {
                    // Create a message back:
                    let unfurledPayload = {
                        source: 'node_util',
                        command: 'file_preview_ready',
                        host: 'localhost', //TODO: We shoudl probably send unique host name for HA cluster
                        message_id: dataObj.payload.message_id,
                        path: dataObj.payload.path
                    };

                    let msg = 'JSONRTMOBJ#' + JSON.stringify(unfurledPayload);
                    logger.info("Publishing to MQ " + msg);

                    // Process and send it back via producer
                    if (status) {
                        mqProducer.publishToMQ(msg);
                    }

                    logger.info("END CONVERSION " + dataObj);

                });
            }
            catch(err) {
                    // Nothing to do. Just ignore.
                    logger.error(err);
                    return;
                }
        };

        const sendFirebaseMessage = async function (dataObj) {
            try {

                const allTokens = Object.values(dataObj.payload.fcm_tokens);
                const androidTokens = allTokens.filter(item => item.client_app === 'android').map(item => item.device_id);
                const iosTokens = allTokens.filter(item => item.client_app === 'ios').map(item => item.device_id);
                const otherTokens = allTokens.filter(item => item.client_app !== 'android' && item.client_app !== 'ios').map(item => item.device_id);

                const removeInvalidTokens = (response, tokens) => {
                    if (response.failureCount > 0) {
                        response.responses.forEach((item, index) => {
                            if (!item.success) {

                                if (item.error.errorInfo.message.toLowerCase().includes('is not a valid fcm registration token')) {

                                    // invalid token detected, so remove it from our database
                                    const returnMessagePayload = {
                                        source: 'node_util',
                                        command: 'remove_invalid_fcm_device_id',
                                        host: 'localhost',
                                        device_id: tokens[index],
                                    };

                                    const msg = 'JSONRTMOBJ#' + JSON.stringify(returnMessagePayload);
                                    //logger.info("Publishing to MQ " + msg);

                                    logger.error(`Invalid token found. Removing it: ${tokens[index]}`);

                                    // Process and send it back via producer
                                    mqProducer.publishToMQ(msg);

                                } else {

                                    // not an invalid token, it's likely that the error comes from our end, so just log it.
                                    logger.error('Error: ' + item.error);

                                }

                            }
                        });
                    }
                };


                const data = {};
                for (let index in dataObj.payload.payload) {
                    if( dataObj.payload.payload.hasOwnProperty(index) ) {
                        data[index] = JSON.stringify(dataObj.payload.payload[index]);
                    }
                }



                if (androidTokens.length > 0) {
                    logger.info('Sending messages to FCM android Clients: ' + JSON.stringify(androidTokens));

                    const androidPayload = {
                        tokens: androidTokens,
                        data,
                    };

                    // Sending messages to android devices
                    // logger.info('Message payload: ' + JSON.stringify(androidPayload));
                    firebaseAdmin.messaging().sendMulticast(androidPayload).then(response => {
                        removeInvalidTokens(response, androidTokens);
                    });
                }

                if (iosTokens.length > 0) {

                    logger.info('Sending messages to FCM iOS Clients: ' + JSON.stringify(iosTokens));

                    const payload = {
                        tokens: iosTokens,
                        apns: {
                            payload: {
                                aps: {
                                    category: dataObj.payload.event,
                                    "alert": {},
                                    "mutable-content": 1,
                                },
                                data,
                            },
                        },

                    };

                    if (dataObj.payload.message_title || dataObj.payload.message_body) {
                        if (dataObj.payload.message_title) {
                            payload.apns.payload.aps.alert.title = dataObj.payload.message_title;
                        }
                        if (dataObj.payload.message_body) {
                            payload.apns.payload.aps.alert.body = dataObj.payload.message_body;
                        }
                    }

                    // Sending messages to ios devices
                    // logger.info('Message payload: ' + JSON.stringify(payload));
                    firebaseAdmin.messaging().sendMulticast(payload).then(response => {
                        removeInvalidTokens(response, iosTokens);
                    });
                }

                // this piece of code is a legacy for iOS (we probably don't need it anymore)
                if (otherTokens.length > 0) {
                    logger.info('Sending messages to FCM other Clients (unknown): ' + JSON.stringify(otherTokens));
                    const payload = {
                        tokens: otherTokens,
                        apns: {
                            payload: {
                                aps: {
                                    badge: dataObj.payload.badge,
                                },
                            },
                        },
                        data,
                    };

                    if (dataObj.payload.message_title || dataObj.payload.message_body) {
                        payload.notification = {};
                        if (dataObj.payload.message_title) {
                            payload.notification.title = dataObj.payload.message_title;
                        }
                        if (dataObj.payload.message_body) {
                            payload.notification.body = dataObj.payload.message_body;
                        }
                    }

                    // Sending messages to other devices
                    // logger.info('Message payload: ' + JSON.stringify(payload));
                    firebaseAdmin.messaging().sendMulticast(payload).then(response => {
                        removeInvalidTokens(response, otherTokens);
                    });
                }

            } catch (err) {
                // Nothing to do. Just ignore.
                logger.error(err);
            }
        };

        const stripMessageFromEmail = async function (dataObj) {
            //logger.info('Stripping typed message from email...');

            const plainText = dataObj.payload.plainText;

            // remove the signature block from the email
            const talon = require("talon");
            const extractSignature = talon.signature.bruteforce.extractSignature;
            let {text:strippedMessage} = extractSignature(plainText);

            // remove the quotations from previous emails
            const planer = require('planer');
            strippedMessage = planer.extractFromPlain(strippedMessage);

            const returnMessagePayload = {
                source: 'node_util',
                command: 'post_email_response_message',
                host: 'localhost', //TODO: We shoudl probably send unique host name for HA cluster
                user_id: dataObj.payload.user_id,
                channel_id: dataObj.payload.channel_id,
                message: strippedMessage.trim(),
                attachments: dataObj.payload.attachments
            };

            const msg = 'JSONRTMOBJ#' + JSON.stringify(returnMessagePayload);
            //logger.info("Publishing to MQ " + msg);

            // Process and send it back via producer
            mqProducer.publishToMQ(msg);


        };

    }


}


module.exports = MQConsumer;