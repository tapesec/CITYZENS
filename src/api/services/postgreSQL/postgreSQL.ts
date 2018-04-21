import * as pg from 'pg';

export default class PostgreSQL {
    private client: pg.Client;

    constructor(opts: any) {
        this.client = new pg.Client(opts);
    }

    public async query(queryString: string, values: any[]) {
        await this.client.connect();
        const result = await this.client.query(queryString, values);
        await this.client.end();
        return result;
    }
}
