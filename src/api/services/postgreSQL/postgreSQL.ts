import * as pg from 'pg';

export default class PostgreSQL {
    constructor(private opts: pg.ClientConfig) {}

    public async tableExist(name: string) {
        const queryString = `SELECT relname FROM pg_class WHERE relname = '${name}'`;
        const client = new pg.Client(this.opts);

        const result = await this.query(queryString);
        return result.rowCount !== 0;
    }

    public async query(queryString: string, values?: any[]) {
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
