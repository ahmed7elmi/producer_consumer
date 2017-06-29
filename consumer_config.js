var config = {};

config.connectionOptions = {
  'host': 'localhost',
  'port': 61613,
  'connectHeaders':{
    'host': '/',
    'login': 'admin',
    'passcode': 'admin',
    'heart-beat': '5000,5000'
  }
}

// configs for log4js usage
config.logDir = "log/";
config.logLevel = "ERROR";

//
config.queueName = 'test';

module.exports = config;
