import { OK, NOT_FOUND } from 'http-status-codes';
import ErrorHandler from '../errors/ErrorHandler';
import retryPromise from '../../services/errors/retryPromise';
import auth0, { Auth0 } from '../../libs/Auth0';
import CityzenId from '../../../domain/cityzens/model/CityzenId';
const request = require('request');
import config from '../../config';

class FilestackService {
    constructor(protected request: any) {}

    public async remove(fileId: string) {
        const options = {
            method: 'DELETE',
            url: `${config.filestack.apiUrl}${fileId}?key=${config.filestack.apiKey}&policy=${
                config.filestack.security.policy
            }=&signature=${config.filestack.security.signature}`,
            headers: { 'content-type': 'application/json' },
        };
        return this.retryApiCall(options);
    }

    private retryApiCall = (opts: any): Promise<any> => {
        const retryOpts = {
            retries: 2,
        };
        return retryPromise(() => this.apiCall(opts), retryOpts);
    };

    private apiCall = (options: any): any => {
        return new Promise((resolve, reject) => {
            this.request(options, (error: any, response: any, body: any) => {
                if (error) {
                    reject(new Error(error));
                } else if (response.statusCode !== OK && response.statusCode !== NOT_FOUND) {
                    reject(body);
                } else {
                    resolve(body);
                }
            });
        });
    };
}

export default FilestackService;
