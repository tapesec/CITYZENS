import { TableSchema, Column, DataType } from './postgreSQL';

export const CITYZEN_TABLE_NAME = 'cityzens';
export const CITYZEN_TABLE_SCHEMA = new TableSchema(CITYZEN_TABLE_NAME, [
    new Column('user_id', DataType.text, true, true, true, 0),
    new Column('password', DataType.text, false, false, false, 0),
    new Column('email', DataType.text, true, true, false, 0),
    new Column('pseudo', DataType.text, false, false, false, 0),
    new Column('picture', DataType.text, false, false, false, 0),
    new Column('is_admin', DataType.bool, false, false, false, 0, 'FALSE'),
    new Column('favorites_hotspots', DataType.text, false, false, false, 1),
]);
