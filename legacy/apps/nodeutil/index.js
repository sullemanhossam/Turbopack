const logger = require('./util/logger');
const MQConsumer = require("./kafkaconsumer");
const MQProducer = require('./kafkaproducer');

const mq = new MQProducer();
mq.initializeConnection(readyToProceed);

logger.info("Waiting for Kafka Producer to be ready")
// We are ready
function readyToProceed() {

    logger.info("Starting Kafka Consumer--------------------------");

    const mqConsumer = new MQConsumer();
    mqConsumer.initialize(mq);
}





