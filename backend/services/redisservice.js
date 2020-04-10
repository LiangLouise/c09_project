const redis = require('redis');
const session = require('express-session');
const config = require('config');
const logger = require('../config/loggerconfig');

const redisClient = redis.createClient();

redisClient.on('connect', function() {
    logger.info('Redis client connected');
});

redisClient.on("error", function(err){
    logger.error(err);
});
let RedisStore = require('connect-redis')(session);

exports.SessionStore= function() {
    return new RedisStore({
        host: config.get('redis.host'),
        port: config.get('redis.port'),
        client: redisClient,
        ttl: config.get('redis.ttl')
    });
};

exports.redisClient = redisClient;
