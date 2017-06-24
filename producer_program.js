var stompit = require('stompit');
var config = require('./config.js');
var moment = require('moment');
var messageFactory = require('./messageFactory.js');
var log4js = require('log4js');


// configuring logging
log4js.loadAppender('console');
log4js.loadAppender('file');
log4js.addAppender(log4js.appenders.file('logs/producer.log'), 'producer');
 
var logger = log4js.getLogger('producer');
logger.setLevel('INFO');

logger.info('--------------------------------------------');
logger.info('Starting Producer Session');
stompit.connect(config.connectionOptions, function(error, client) {

  logger.info('Starting...');
  if (error)
    return logger.error('connect error ' + error.message);

  var sendHeaders = {
    'destination': '/queue/test',
    'content-type': 'text/plain'
  };

  var messagesCount = 0;
  var duration = config.duration;
  var waitTime = 1000/config.productionRate; // time to wait between messages
  //displayConfigurations();

  var startTime = moment();
  var elapsedTime = (moment() - startTime)/1000; // elapsed time in seconds

  var intervalObj = setInterval(function() {
    var messageObj = messageFactory.createMessage();
    var message = JSON.stringify(messageObj);
    var frame = client.send(sendHeaders);
    frame.write(message);
    frame.end();
    messagesCount++;
    //logger.info('Message #' + messagesCount + ' produced, mesasge id: ' + messageObj.message_id)
    // updating elapsed time
    //displayInfo(messagesCount )
    elapsedTime = (moment() - startTime)/1000;
  }, waitTime);
  

  // schedueling the closure after the specified duration
  setTimeout(function() {
    // cancel the setInterval call
    clearInterval(intervalObj);

    var messageFrequency = messagesCount / elapsedTime;
    //console.log(messagesCount + " messages were sent in " + elapsedTime + " sec, actual production rate = " + messageFrequency + " message per second.");
    client.disconnect();
    displayInfo(logger, messagesCount, elapsedTime, messageFrequency)
  }, duration*1000);
});

function displayInfo(logger, messagesCount, elapsedTime, messageFrequency) {
  logger.info('Runtime duration: ' + config.duration + ' seconds \n');
  logger.info('Planned message production rate: ' + config.productionRate + ' message per second (a message every ' + (1000/config.productionRate) + ' ms)');
  logger.info('Total messages sent: ' + messagesCount);
  logger.info(messagesCount + " messages were sent in " + elapsedTime + " sec, actual production rate = " + messageFrequency + " message per second.")
}