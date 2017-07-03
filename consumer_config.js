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

config.redisConnectionOptions = {
  'host': '127.0.0.1',
  'port': 6379
}

// configs for log4js usage
config.logDir = "log/";
config.logLevel = "ERROR";

//
config.queueName = 'test';

module.exports = config;
