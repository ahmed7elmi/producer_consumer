var stompit = require('stompit');
var config = require('./config.js');
var moment = require('moment');
var sleep = require('system-sleep');
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
  displayConfigurations();

  var startTime = moment();
  var elapsedTime = (moment() - startTime)/1000; // elapsed time in seconds


  while(elapsedTime < duration) {
    var messageObj = messageFactory.createMessage();
    var message = JSON.stringify(messageObj);
    var frame = client.send(sendHeaders);
    frame.write(message);
    frame.end();
    messagesCount++;
    logger.info('Message #' + messagesCount + ' produced, mesasge id: ' + messageObj.message_id)
    // updating elapsed time
    elapsedTime = (moment() - startTime)/1000;
    sleep(waitTime);
  }

  var messageFrequency = messagesCount / elapsedTime;
  console.log(messagesCount + " messages were sent in " + elapsedTime + " sec, actual production rate = " + messageFrequency + " message per second.");

  client.disconnect();
});

function displayConfigurations() {
  logger.info('Runtime duration: ' + config.duration);
  logger.info('Message production rate: ' + config.productionRate);
  logger.info('A message every ' + (1000/config.productionRate) + ' ms');
  
}
