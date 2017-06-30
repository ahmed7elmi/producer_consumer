var stompit = require('stompit');
var config = require('./producer_config.js');
var moment = require('moment');
var messageFactory = require('./messageFactory.js');
var log4js = require('log4js');


// configuring logging
log4js.loadAppender('console');
log4js.loadAppender('file');
log4js.addAppender(log4js.appenders.file('logs/producer.log'), 'producer');
 
var logger = log4js.getLogger('producer');
logger.setLevel('INFO');

logger.info('----------------------------------------------------------------------------------------');
logger.info('Starting Producer Session');
stompit.connect(config.connectionOptions, function(error, client) {

  logger.info('Producing messages at rate ' + config.productionRate + ' messages per second for a ' + config.duration + ' seconds (' + config.duration/60 + ' minutes)...' );
  if (error)
    return logger.error('connect error ' + error.message);

  var sendHeaders = {
    'destination': '/queue/' + config.queueName,
    'content-type': 'text/plain'
  };

  var messagesCount = 0;
  var duration = config.duration;
  var waitTime = 1000/config.productionRate; // time to wait between messages

  var startTime = moment();
  var elapsedTime = (moment() - startTime)/1000; // elapsed time in seconds

  var intervalObj = setInterval(function() {
    var messageObj = messageFactory.createMessage();
    var message = JSON.stringify(messageObj);
    var frame = client.send(sendHeaders);
    frame.write(message);
    frame.end();
    messagesCount++;
    // updating elapsed time
    elapsedTime = (moment() - startTime)/1000;
  }, waitTime);

  // console animations
  var P = ["\\", "|", "/", "-"];
  var x = 0;
  var animIntervalObj = setInterval(function() {
    process.stdout.write("\r" + P[x++]);
    x = x % P.length;
  }, 250);
  

  // schedueling the closure after the specified duration
  setTimeout(function() {
    // cancel the setInterval call
    clearInterval(intervalObj);
    clearInterval(animIntervalObj);

    var messageFrequency = messagesCount / elapsedTime;
    client.disconnect();
    
    process.stdout.write("\r");
    logger.info('Done.');
    logger.info(messagesCount + " messages were sent in " + elapsedTime + " sec");
    logger.info("Actual production rate = " + messageFrequency + " messages per second.");
    logger.info('----------------------------------------------------------------------------------------');
  }, duration*1000);
});