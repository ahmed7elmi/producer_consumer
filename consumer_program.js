var sleep = require('system-sleep');
var config = require('./config.js');
var consume = require('./consume.js');


//while (true) {
  for (var i = 0; i < 100; i++) {
    consume('test', config.connectionOptions, function (error, data) {
      if (error) {
        return console.error(error);
      }
      console.log('>>> ' + data);
    });
  }
  //sleep(1);
//}
