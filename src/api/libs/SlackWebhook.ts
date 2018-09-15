import { OK } from 'http-status-codes';
import retryPromise from '../services/errors/retryPromise';
const request = require('request');
export interface SlackWebhookOptions {
    url: string;
}

export const createWebhook = (opts?: SlackWebhookOptions): Webhook =>
    WebhookHandler.buildWebhook(opts);

export const getWebhook = (opts?: SlackWebhookOptions): Webhook =>
    WebhookHandler.buildWebhook(opts);

export class WebhookHandler {
    static instance: Webhook = null;
    static buildWebhook(opts?: SlackWebhookOptions) {
        if (WebhookHandler.instance === null) {
            if (opts) {
                WebhookHandler.instance = new SlackWebhook(opts);
            } else {
                WebhookHandler.instance = new NoopsWebhook();
            }
        }
        return WebhookHandler.instance;
    }
}

export interface Webhook {
    alert(message: string): Promise<any>;
}

class SlackWebhook implements Webhook {
    protected opts: SlackWebhookOptions;
    protected request: any;

    constructor(options: SlackWebhookOptions) {
        this.opts = options;
        this.request = request;
    }

    public alert = (message: string): Promise<any> => {
        const options = {
            method: 'POST',
            url: this.opts.url,
            headers: {
                'content-type': 'application/json',
            },
            body: {
                text: message,
            },
            json: true,
        };
        return this.retryApiCall(options);
    };

    private retryApiCall = (opts: any): Promise<any> => {
        const retryOpts = {
            retries: 5,
        };
        return retryPromise(() => this.apiCall(opts), retryOpts);
    };
    private apiCall = (options: any): any => {
        return new Promise((resolve, reject) => {
            this.request(options, (error: any, response: any, body: any) => {
                if (error) {
                    reject(new Error(error));
                } else if (response.statusCode !== OK) {
                    reject(body);
                } else {
                    resolve(body);
                }
            });
        });
    };
}

class NoopsWebhook implements Webhook {
    constructor(opts?: SlackWebhookOptions) {}

    alert(message: string): Promise<any> {
        // no ops
        return Promise.resolve();
    }
}

export default SlackWebhook;
