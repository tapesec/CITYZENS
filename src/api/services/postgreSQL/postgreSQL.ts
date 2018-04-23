import * as pg from 'pg';

export default class PostgreSQL {
    constructor(private opts: pg.ClientConfig) {}

    public async query(queryString: string, values: any[]) {
        const client = new pg.Client(this.opts);

        await client.connect();
        try {
            const result = await client.query(queryString, values);
            await client.end();
            return result;
        } catch (err) {
            await client.end();
            throw err;
        }
    }
}
