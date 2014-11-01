var redis = require('redis');
var config = require('../config/app');
var redisClient = redis.createClient(config.redis_port, config.redis_host);

redisClient.auth(config.redis_pwd);
redisClient.on('error', function(err) {
  console.log({error: err});
});

redisClient.on('connect', function() {
  console.log('redis is ready');
});

exports.redis = redis;
exports.redisClient = redisClient;
