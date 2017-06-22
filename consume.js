// Consumer Worker

var stompit = require('stompit');

module.exports = function(queueName, connectionOptions, callback /* message/error handler */) {
  stompit.connect(connectionOptions, function(error, client) {

    if (error) {
      return callback('Connect Error: ' + error);
    }

    var subscribeHeaders = {
      'destination': '/queue/' + queueName,
      'ack': 'client-individual'
    };

    client.subscribe(subscribeHeaders, function(error, message) {

      if (error) {
        return callback('Subscribe Error: ' + error);
      }

      message.readString('utf-8', function(error, body) {

        if (error) {
          return callback(error);
        }

        client.ack(message);
        client.disconnect();

        // no errors and data recieved successfully.
        return callback(null, body);
      });
    });
  });

}
