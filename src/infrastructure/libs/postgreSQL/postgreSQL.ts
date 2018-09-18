import { Pool } from 'pg';

export class PostgreSQL {
    private pool: Pool;

    constructor() {
        this.pool = new Pool();
    }

    public async query(queryString: string, values?: any[]) {
        try {
            const result = await this.pool.query(queryString, values);
            return result;
        } catch (err) {
            throw err;
        }
    }
}
export default new PostgreSQL();
