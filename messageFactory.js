const uuid = require('uuid/v4');
var moment = require('moment');

module.exports = {

  createMessage: function () {
    return {
      'account_id': 100,
      'account_name': 'xxx',
      'interface_id': 2,
      'message_id': uuid(), // new guid everytime
      'source_addr': 'xxxxxx',
      'destination_addr': '9xxxxxx',
      'coding': 2,
      'text_length': 58,
      'concatenation': 1,
      'message_text': 'test message',
      'UHD': '%05%00%03%8B%02%02',
      'flash': 0,
      'validaty_period': 1440,
      'delivery_time': 1440,
      'smpp_port': 2222,
      'registered_delivery': 0,
      'dlr_ip': 'xx.xx.xxx.xx',
      'dlr_port': 201,
      'sm_timestamp': moment()
    };
  }
};
