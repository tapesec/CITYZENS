import { OK, NOT_FOUND } from 'http-status-codes';
import retryPromise from './retryPromise';
import config from '../../api/config';

class FilestackApi {
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

export default FilestackApi;
