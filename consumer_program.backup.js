var sleep = require('system-sleep');
var config = require('./config.js');
//var consume = require('./consume.js');
var stompit = require('stompit');

var log4js = require('log4js');


// configuring logging
log4js.loadAppender('console');
log4js.loadAppender('file');
log4js.addAppender(log4js.appenders.file('logs/producer.log'), 'producer');
 
var logger = log4js.getLogger('producer');
logger.setLevel('TRACE');


//ConsumeWorker();
queueName = 'test';
(function (callback) {
  stompit.connect(config.connectionOptions, (error, client) => {
    logger.trace(">> Entering stompit.connect callback...");
    if (error) {
      return callback('Connect Error: ' + error);
    }
    var subscribeHeaders = {
      'destination': '/queue/' + queueName,
      'ack': 'client-individual'
    };

    logger.trace(">> Before calling client.subscribe() ...");
    client.subscribe(subscribeHeaders, (error, message) => {
      logger.trace(">> Entering client.subscribe callback...");
      if (error) {
        return callback('Subscribe Error: ' + error);
      }
      (function consumeNext() {
        logger.trace(">> Entering consumeNext callback...");
        message.readString('utf-8', function(error, body) {
          if (error) {
            return callback('Consumption Error: ' + error);
          }

          client.ack(message);
          return callback(null, body);
        });
        // 
        setTimeout(function() {
          consumeNext();
        }, 0);
        //consumeNext();
      })();
      logger.trace(">> Exiting client.subscribe callback...");
    });
    logger.trace(">> After calling client.subscribe() ...");

    logger.trace(">> Before calling client.disconnect() ...");
    //client.disconnect(); // never reached
    logger.trace(">> After calling client.disconnect() ...");
  });


  // function consume (queueName, connectionOptions, callback /* message/error handler */) {
  //   stompit.connect(connectionOptions, function(error, client) {

  //     if (error) {
  //       return callback('Connect Error: ' + error);
  //     }

  //     var subscribeHeaders = {
  //       'destination': '/queue/' + queueName,
  //       'ack': 'client-individual'
  //     };

  //     client.subscribe(subscribeHeaders, function(error, message) {

  //       if (error) {
  //         return callback('Subscribe Error: ' + error);
  //       }

  //       message.readString('utf-8', function(error, body) {

  //         if (error) {
  //           return callback(error);
  //         }

  //         client.ack(message);
  //         client.disconnect();

  //         // no errors and data recieved successfully.
  //         return callback(null, body);
  //       });
  //     });
  //   });

  // }

  // consume('test', config.connectionOptions, function (error, data) {
  //   if (error) {
  //     console.error(error);
  //   } else {
  //     messageObj = JSON.parse(data);
  //     console.log('message consumed - message id: ' + messageObj.message_id);

  //     // writing to redis
  //   }
  //   ConsumeWorker();
  // });
})( /* the callback */ (error, data) => {
  if (error) {
    return console.log(error);
  }
  else {
    messageObj = JSON.parse(data);
    console.log('message consumed - message id: ' + messageObj.message_id);
  }
});