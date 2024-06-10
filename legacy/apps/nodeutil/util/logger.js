// TODO - Move this stuff to a common nodejs folder (same code is used by nodeutil and kafkaworker)
const winston = require('winston');
const DailyRotateFile = require('winston-daily-rotate-file');
const { createLogger, format, transports } = winston;

const logger = winston.createLogger({
    format: format.combine(
        format.timestamp(),
        format.printf(i => `${i.timestamp} | ${i.message}`)
    ),
    defaultMeta: { service: 'nodeutil' },
    transports: [
        //
        // - Write to all logs with level `info` and below to `combined.log`
        // - Write all logs error (and below) to `error.log`.
        //
        new winston.transports.Console({
            colorize: true,
            json: false
        }),
        new (DailyRotateFile)({
            filename: 'logs/nu-error-%DATE%.log',
            datePattern: 'YYYY-MM-DD-HH',
            zippedArchive: true,
            maxSize: '20m',
            maxFiles: '14d',
            level: 'error',
            json: false
        }),
        new (DailyRotateFile)({
            filename: 'logs/nu-combined-%DATE%.log',
            datePattern: 'YYYY-MM-DD-HH',
            zippedArchive: true,
            maxSize: '20m',
            maxFiles: '14d',
            json: false
        })
    ]
});




module.exports = logger;