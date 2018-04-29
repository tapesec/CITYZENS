import PostgreSQL from './postgreSQL';
import { CITYZEN_TABLE_NAME, CITYZEN_TABLE_SCHEMA } from './constants';

const cityzens = async (postgre: PostgreSQL) => {
    const exist = await postgre.tableExist(CITYZEN_TABLE_NAME);
    if (exist) return;

    postgre.createTable(CITYZEN_TABLE_SCHEMA);
};

const CheckAndCreateTable = {
    cityzens,
};

export default CheckAndCreateTable;
