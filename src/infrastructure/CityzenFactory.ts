import Cityzen from '../domain/cityzens/model/Cityzen';

export default class CityzenFactory {
    constructor() {}

    // data _must_ be from PostgreSQL db.
    public build(data: any): Cityzen {
        return new Cityzen(
            data.user_id,
            data.email,
            data.nickname,
            data.is_admin,
            new Set<string>(),
            'No description available',
        );
    }
}
