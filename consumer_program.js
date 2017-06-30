var config = require('./consumer_config.js');
var stompit = require('stompit');
var log4js = require('log4js');
var handler = require('./consumer_message_handler.js');

// configuring logging
log4js.loadAppender('console');
log4js.loadAppender('file');
log4js.addAppender(log4js.appenders.file('logs/consumer.log'), 'consumer');
var logger = log4js.getLogger('consumer');
logger.setLevel('TRACE');

//
let totalConsumed = 0;
let messagesBuffer = [];
let messagesBufferSize = 0;
let patchSize = 20;
let patchesCounter = 1;

stompit.connect(config.connectionOptions, (error, client) => {
  if (error) {
    return logger.error('Connection Error: ' + error);
  }
  var subscribeHeaders = {
    'destination': '/queue/' + config.queueName,
    'ack': 'client-individual'
  }
  client.subscribe(subscribeHeaders, (error, message) => {
    if (error) {
      return logger.error('Subscribtion Error: ' + error)
    }
    message.readString('utf-8', (error, body) => {
      if (error) {
        return logger.error('Consumption Error: ' + error)
      }
      client.ack(message)
      totalConsumed++;
      messageObj = JSON.parse(body);
      logger.info('message consumed - message id: ' + messageObj.message_id + ' - total (' + totalConsumed + ')');
      handler.handleMessage(messageObj, (error, lastId) => {
        if (error) {
          return logger.error(error);
        }
        logger.info('>>> Patch #' + lastId + ' sent to redis');
      });
    });
  });
});