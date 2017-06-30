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

//
config.queueName = 'test';
config.duration = 90*60; // seconds
config.productionRate = 250; // message per second

module.exports = config;
