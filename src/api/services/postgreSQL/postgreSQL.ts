import * as pg from 'pg';

export enum DataType {
    text = 'text',
    int = 'integer',
    bool = 'boolean',
}

export class Column {
    constructor(
        public name: string,
        public dataType: DataType,
        public required: boolean,
        public unique: boolean,
        public primaryKey: boolean,
        public dimension: number,
        public defaultValue?: string,
    ) {}
}

export class TableSchema {
    constructor(public name: string, public columns: Column[]) {}
}

export default class PostgreSQL {
    constructor(private opts: pg.ClientConfig) {}

    public async tableExist(name: string) {
        const queryString = `SELECT relname FROM pg_class WHERE relname = '${name}'`;
        const client = new pg.Client(this.opts);

        const result = await this.query(queryString);
        return result.rowCount !== 0;
    }

    public async createTable(schema: TableSchema) {
        let queryString = 'CREATE TABLE ' + schema.name + ' (';
        const columns: string[] = [];
        schema.columns.forEach((column, i) => {
            columns.push(
                `${column.name} ${column.dataType}${'[]'.repeat(column.dimension)} ${
                    column.required ? 'NOT NULL' : ''
                } ${column.defaultValue !== undefined ? 'DEFAULT ' + column.defaultValue : ''} ${
                    column.unique ? 'UNIQUE' : ''
                } ${column.primaryKey ? 'PRIMARY KEY' : ''}`,
            );
        });
        queryString += columns.join(', ');
        queryString += ')';

        return this.query(queryString);
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
