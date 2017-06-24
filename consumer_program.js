var config = require('./config.js')
var stompit = require('stompit')
var log4js = require('log4js')
var redis = require("redis")

// configuring logging
log4js.loadAppender('console')
log4js.loadAppender('file')
log4js.addAppender(log4js.appenders.file('logs/consumer.log'), 'consumer')
var logger = log4js.getLogger('consumer')
logger.setLevel('TRACE')

//
let queueName = 'test'
let totalConsumed = 0;
let messagesBuffer = []
let messagesBufferSize = 0;
let patchSize = 20;
let patchesCounter = 1;

stompit.connect(config.connectionOptions, (error, client) => {
  if (error) {
    //
    return logger.error('Connection Error: ' + error)
  }
  var subscribeHeaders = {
    'destination': '/queue/' + queueName,
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
        
        /* To do: 
        1. check if the key 'lastId' exist

        2. get the value of 'lastId'
        
        3. use id as the key for the new patche

        4. increment the value of 'lastId'
        */

        // send to redis store
        redisClient = redis.createClient()
        redisClient.on("error", function (err) {
          console.log("Error " + err);
        });
        redisClient.set('p' + patchesCounter, JSON.stringify(messagesBuffer), redis.print);
        redisClient.quit();
        patchesCounter++

        // clear the buffer
        messagesBuffer = []
        messagesBufferSize = 0;
      }

      logger.info('message consumed - message id: ' + messageObj.message_id + ' - total (' + totalConsumed + ')')
    })
  })
  //client.on('error', () => client.disconnect());
})