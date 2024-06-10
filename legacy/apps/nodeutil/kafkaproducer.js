const logger = require('./util/logger');
const Kafka = require('node-rdkafka');
const config = require('config');

//log(Kafka.librdkafkaVersion);
const host = require('./util/host');
const SERVER_HOST = host();
const client_id =  'nodeutil-' + SERVER_HOST;
logger.info("CLIENT ID = " +  client_id);

const KAFKA_HOST = config.get('kafka_host');
logger.info("KAFKA BROKER = " +  KAFKA_HOST);

//TODO: This may need to be configurable
const producer = new Kafka.HighLevelProducer({
    'client.id' : client_id,
    'metadata.broker.list': KAFKA_HOST,
    'batch.num.messages': '1',
    'queue.buffering.max.ms':'50',
    'socket.blocking.max.ms':'50',
    'socket.nagle.disable':'true',

});


//logging all errors
producer.on('event.error', (err) => {
    //logger.error('Error from producer');
    //logger.error(err);
});


/**
 * Class to send to Kafka message queue
 */
class MQProducer {

    initializeConnection(indicateReady) {
        producer.connect();

        producer.on('ready', ()=> {
            // Call the function to indicate we are ready
            indicateReady();
        });
    }
    /**
     * This is a simple method to send a message to PHP queue
     * @param messageToSend
     */
    publishToMQ(messageToSend) {

        try {
            //Send it to the PHP queue
            producer.produce('as_parallel_bg_queue_low_priority', // The topic
                null,   // The partition - Let it auto select
                Buffer.from(messageToSend),  // The message to send
                null,  // No keys
                Date.now(),
                (err, offset) => {
                    if (err) {
                        logger.error(err);
                    }
                });
        }
        catch (err) {
            logger.error("Failed to publish to KAFKA");
        }

    }
}



module.exports = MQProducer;