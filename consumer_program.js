var config = require('./consumer_config.js');
var stompit = require('stompit');
var log4js = require('log4js');
var redis = require("redis");

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
    //
    return logger.error('Connection Error: ' + error);
  }
  var subscribeHeaders = {
    'destination': '/queue/' + config.queueName,
    'ack': 'client-individual'
  }
  client.subscribe(subscribeHeaders, (error, message) => {
    if (error) {
      //
      return logger.error('Subscribtion Error: ' + error)
    }
    message.readString('utf-8', (error, body) => {
      if (error) {
        //
        return logger.error('Consumption Error: ' + error)
      }
      client.ack(message)
      totalConsumed++;
      messageObj = JSON.parse(body)
      messagesBuffer.push(messageObj)
      messagesBufferSize++
      if(messagesBufferSize == patchSize) {
        // send to redis store
        redisClient = redis.createClient()
        redisClient.on("error", function (err) {
          console.log("Error " + err);
        });

        // check if the key 'lastId' exist and get its value if exist
        redisClient.get('consumer:lastId', (err, lastId) => {
          if (err) {
            return logger.error('Error while getting consumer:lastId: ' + err);
          }
          if(!lastId) { // if no key with the name consumer:lastId, create one
            lastId = 1;
            redisClient.set('consumer:lastId', lastId);
            logger.warn('The key consumer:lastId is not found')
          }
          redisClient.set('consumer:' + lastId, JSON.stringify(messagesBuffer));//, redis.print);
          // increment the value of 'lastId'
          redisClient.incr('consumer:lastId');
          redisClient.quit();
          logger.info('Patch #' + lastId + 'sent to redis');
          // clear the buffer
          messagesBuffer = [];
          messagesBufferSize = 0;
        });
      }

      logger.info('message consumed - message id: ' + messageObj.message_id + ' - total (' + totalConsumed + ')')
    })
  })
  //client.on('error', () => client.disconnect());
})