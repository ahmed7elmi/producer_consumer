var sleep = require('system-sleep');
var config = require('./config.js');
var consume = require('./consume.js');


var waitTimeBetweenReads = 1000/config.consumptionRate;

ConsumeWorker();

function ConsumeWorker() {
  consume('test', config.connectionOptions, function (error, data) {
    if (error) {
      console.error(error);
    } else {
      messageObj = JSON.parse(data);
      console.log('message consumed - message id: ' + messageObj.message_id);

      // writing to redis
    }
    ConsumeWorker();
  });
}