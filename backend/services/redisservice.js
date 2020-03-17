const redis = require('redis');
const session = require('express-session');
const config = require('config');
const logger = require('../config/loggerconfig');

let RedisStore = require('connect-redis')(session);
let redisClient = redis.createClient();

redisClient.on("error", function(err){
    logger.error(err);
});

function SessionStore() {
    return new RedisStore({
        host: config.get('redis.host'),
        port: config.get('redis.port'),
        client: redisClient,
        ttl: config.get('redis.ttl')
    });
}

module.exports = SessionStore;
