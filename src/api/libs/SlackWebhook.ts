import config from '../config';
import { OK } from 'http-status-codes';
const request = require('request');

export interface SlackWebhookOptions {
    url : string;
}

class SlackWebhook {

    protected opts : SlackWebhookOptions;
    protected request : any;

    constructor(options : SlackWebhookOptions, request : any) {
        this.opts = options;
        this.request = request;
    }

    public alert = (message: string) : Promise<any> => {
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
        return this.apiCall(options);
    }

    private apiCall = (options : any) : any => {
        return new Promise((resolve, reject) => {
            this.request(options, (error : any, response : any, body : any) => {
                console.log(response.body, response.statusCode);
                if (error) {
                    reject(new Error(error));
                } else if (response.statusCode !== OK) {
                    reject(body);
                } else {
                    resolve(body);
                }
            });
        });
    }
}

export default SlackWebhook;
