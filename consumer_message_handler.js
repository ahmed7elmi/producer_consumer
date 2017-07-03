var redis = require("redis");
var config = require('./consumer_config.js');

module.exports = {
    messagesBuffer: [],
    messagesBufferSize: 0,
    patchSize: 20,

    handleMessage: function(messageObj, callback) {
        this.messagesBuffer.push(messageObj);
        this.messagesBufferSize++
        if(this.messagesBufferSize == this.patchSize) {
            // send to redis store
            redisClient = redis.createClient(config.redisConnectionOptions);
            redisClient.on("error", function (err) {
                return callback('Redis Error: ' + err);
            });

            // check if the key 'lastId' exist and get its value if exist
            redisClient.get('consumer:lastId', (err, lastId) => {
                if (err) {
                    return callback('Error getting consumer:lastId: ' + err);
                }
                if(!lastId) { // if no key with the name consumer:lastId, create one
                    lastId = 1;
                    redisClient.set('consumer:lastId', lastId);
                }
                redisClient.set('consumer:' + lastId, JSON.stringify(this.messagesBuffer));
                // increment the value of 'lastId'
                redisClient.incr('consumer:lastId');
                redisClient.quit();
                // clear the buffer
                this.messagesBuffer = [];
                this.messagesBufferSize = 0;
                // signaling the caller about the written patch
                callback(null, lastId);
            });
        }
    }
};