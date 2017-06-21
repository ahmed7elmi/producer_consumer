var stompit = require('stompit');
var config = require('./config.js');
var moment = require('moment');
var sleep = require('system-sleep');
var messageFactory = require('./messageFactory.js');

stompit.connect(config.connectionOptions, function(error, client) {

  if (error)
    return console.log('connect error ' + error.message);

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

  // initialize the message factory
  messageFactory.init();

  //while(elapsedTime < duration) {
    setTimeout(produce, waitTime, startTime, elapsedTime, duration, client, sendHeaders, messagesCount, waitTime);
    //sleep(waitTime);


  //}

  var messageFrequency = messagesCount / elapsedTime;
  console.log(messagesCount + " messages were sent in " + elapsedTime + " sec, frequency = " + messageFrequency + " message per second.");

  client.disconnect();
});

function produce(startTime, elapsedTime, duration, client, sendHeaders, messagesCount, waitTime) {
  if(elapsedTime >= duration) {
    return;
  }
  message = JSON.stringify(messageFactory.createMessage());
  var frame = client.send(sendHeaders);
  frame.write(message);
  frame.end();
  messagesCount++;
  // updating elapsed time
  elapsedTime = (moment() - startTime)/1000;
  setTimeout(produce, waitTime, startTime, elapsedTime, duration, client, sendHeaders, messagesCount, waitTime); // recursively call and chain another message production after the specified wait time
}

function displayConfigurations() {
  console.log('-----------------------------------------------');
  console.log('Runtime duration: ' + config.duration);
  console.log('Message production rate: ' + config.productionRate);
  console.log('-----------------------------------------------');
}
