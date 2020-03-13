const mongojs = require('mongojs');
const config = require('config');
const db = mongojs(config.get("mongodb.connectionString"), config.get("mongodb.collections"));

db.on('error', function (err) {
    console.log('database error', err);
});

db.on('connect', function () {
    console.log("mongodb.connectionString", config.get("mongodb.connectionString"));
    console.log("mongodb.collections", config.get("mongodb.collections"));
    console.log('database connected');
});

exports.db = db;

