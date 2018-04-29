import { TableSchema, Column, DataType } from './postgreSQL';

export const CITYZEN_TABLE_NAME = 'cityzens';
export const CITYZEN_TABLE_SCHEMA = new TableSchema(CITYZEN_TABLE_NAME, [
    new Column('user_id', DataType.int, true, true, true, 0),
    new Column('email', DataType.text, true, true, false, 0),
    new Column('name', DataType.text, false, false, false, 0),
    new Column('password', DataType.text, true, false, false, 0),
    new Column('picture', DataType.text, false, false, false, 0),
    new Column('nickname', DataType.text, false, false, false, 0),
    new Column('given_name', DataType.text, false, false, false, 0),
    new Column('family_name', DataType.text, false, false, false, 0),
    new Column('is_admin', DataType.bool, false, false, false, 0, 'TRUE'),
    new Column('favorites_hotspots', DataType.text, false, false, false, 1),
    new Column('email_verified', DataType.bool, false, false, false, 0, 'FALSE'),
]);
