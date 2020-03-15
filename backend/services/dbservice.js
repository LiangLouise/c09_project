const mongojs = require('mongojs');
const config = require('config');
const db = mongojs(config.get("mongodb.connectionString"), config.get("mongodb.collections"));
const logger = require('../config/loggerconfig');

db.on('error', function (err) {
    logger.error(err);
});

db.on('connect', function () {
    logger.info("mongodb.connectionString %s",config.get("mongodb.connectionString"));
    logger.info("mongodb.collections %s", config.get("mongodb.collections"));
    logger.info('database connected');
});

module.exports = db;
