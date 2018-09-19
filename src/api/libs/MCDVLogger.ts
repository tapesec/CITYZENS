import { createLogger, transports, Logger } from 'winston';

const logger = createLogger({
    transports: [new transports.Console()],
});

export enum MCDVLoggerEvent {
    BAD_REQUEST = 'BAD_REQUEST',
    NOT_FOUD = 'NOT_FOUND',
    UNAUTHORIZED = 'UNAUTHORIZED',
    HOTSPOT_CREATED = 'HOTSPOT_CREATED',
    UNEXPECTED_ERROR = 'UNEXPECTED_ERROR',
    INVALID_CREDENTIALS = 'INVALID_CREDENTIALS',
    ALGOLIA_SYNC_FAILED = 'ALGOLIA_SYNC_FAILED',
    ALGOLIA_SYNC_SUCCESS = 'ALGOLIA_SYNC_SUCCESS',
    HOTSPOT_BY_AREA_RETRIEVED = 'HOTSPOT_BY_AREA_RETRIEVED',
}

export interface MCDVLogger {
    error(event: MCDVLoggerEvent, message: string, metadata?: Object): void;
    info(event: MCDVLoggerEvent, message: string, metadata?: Object): void;
    debug(event: MCDVLoggerEvent, message: string, metadata?: Object): void;
}

export interface MCDVLoggerOpts {
    env: string;
}

export const createlogger = (opts: MCDVLoggerOpts) => LoggerBuilder.build(opts);
export const getlogger = (opts?: MCDVLoggerOpts) => LoggerBuilder.build(opts);

class LoggerBuilder {
    static instance: MCDVLogger = null;
    static build(opts?: MCDVLoggerOpts) {
        if (LoggerBuilder.instance === null) {
            if (!opts) {
                LoggerBuilder.instance = new NoopsLogger();
            } else {
                LoggerBuilder.instance = new WinstonLogger(opts);
            }
            return LoggerBuilder.instance;
        }
        return LoggerBuilder.instance;
    }
}

class WinstonLogger implements MCDVLogger {
    private logger: Logger;
    constructor(private opts: MCDVLoggerOpts) {
        this.logger = createLogger({
            transports: [new transports.Console()],
        });
    }

    private log(level: string, event: MCDVLoggerEvent, message: string, metadata: Object) {
        const meta = { ...metadata, event, env: this.opts.env };
        this.logger.log(level, message, meta);
    }

    error(event: MCDVLoggerEvent, message: string, metadata: Object = {}) {
        this.log('error', event, message, metadata);
    }
    info(event: MCDVLoggerEvent, message: string, metadata: Object = {}) {
        this.log('info', event, message, metadata);
    }
    debug(event: MCDVLoggerEvent, message: string, metadata: Object = {}) {
        this.log('debug', event, message, metadata);
    }
}

class NoopsLogger implements MCDVLogger {
    error(event: MCDVLoggerEvent, message: string, metadata: Object) {
        // no ops
    }
    info(event: MCDVLoggerEvent, message: string, metadata: Object) {
        // no ops
    }
    debug(event: MCDVLoggerEvent, message: string, metadata: Object) {
        // no ops
    }
}
