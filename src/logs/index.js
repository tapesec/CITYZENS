import { format } from 'util';
var winston = require('winston');
const { combine, timestamp, printf, json } = winston.format;

const myFormat = printf(info => {
    return `${info.timestamp} [${info.label}] ${info.level}: ${info.message}`;
});

const formatCombined = combine(timestamp(), myFormat, json());

const container = new winston.Container();

container.add('http-response-data', {
    transports: [
        new winston.transports.File({ filename: 'http_response.log' }),
        new winston.transports.File({ filename: 'combined.log' }),
        new winston.transports.Console({ format: formatCombined }),
    ],
    format: formatCombined,
});

container.add('log-debug', {
    transports: [
        new winston.transports.File({ filename: 'log_debug.log' }),
        new winston.transports.File({ filename: 'combined.log' }),
        new winston.transports.Console({ format: formatCombined }),
    ],
    format: formatCombined,
});
module.exports = container;
