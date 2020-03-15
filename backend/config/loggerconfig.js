const winston = require('winston');
const config = require('config');

const logger = winston.createLogger({
    level: config.get('logger.level'),
    format: winston.format.combine(
        winston.format.timestamp({
            format: 'YYYY-MM-DD HH:mm:ss'
        }),
        winston.format.errors({ stack: true }),
        winston.format.splat(),
        winston.format.json()
    ),
    transports: [
        // - Write all logs with level `error` and below to `error.log`
        new winston.transports.File({ filename: config.get('logger.errorLogFilePath'), level: 'error' })
    ]
});

if (process.env.NODE_ENV !== 'production') {
    logger.add(new winston.transports.Console({
        format: winston.format.combine(
            winston.format.colorize(),
            winston.format.simple()
        )
    }));
}

module.exports = logger;