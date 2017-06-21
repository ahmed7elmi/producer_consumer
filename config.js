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
config.duration = 30; // seconds
config.productionRate = 250; // message per second
config.consumptionRate = 250; // message per second


module.exports = config;
