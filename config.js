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
config.duration = 1; // seconds
config.productionRate = 100; // message per second

module.exports = config;
