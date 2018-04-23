import PostgreSQL from '../api/services/postgreSQL/postgreSQL';
import AlertHotspot from '../domain/cityLife/model/hotspot/AlertHotspot';
import EventHotspot from '../domain/cityLife/model/hotspot/EventHotspot';
import Hotspot from '../domain/cityLife/model/hotspot/Hotspot';
import IHotspotRepository from '../domain/cityLife/model/hotspot/IHotspotRepository';
import WallHotspot from '../domain/cityLife/model/hotspot/WallHotspot';
import CityzenId from '../domain/cityzens/model/CityzenId';
import { isUuid } from './../api/helpers';
import HotspotFactory from './HotspotFactory';
import { Orm } from './orm';
import { OrmCityzen } from './ormCityzen';

class HotspotRepositoryInMemory implements IHotspotRepository {
    protected hotspots: Map<string, Hotspot> = new Map();

    constructor(
        protected postgre: PostgreSQL,
        protected orm: Orm,
        protected ormCityzen: OrmCityzen,
    ) {}

    public async findByCodeCommune(
        insee: string,
    ): Promise<(WallHotspot | EventHotspot | AlertHotspot)[]> {
        const data = this.orm.hotspot.findAll({ cityId: insee, removed: false });
        const authorsId = Array.from(
            new Set(data.map((entry: any) => new CityzenId(entry.authorId))),
        );

        const authors = await this.ormCityzen.getAllAuthors(this.postgre, authorsId);

        const hotspotsArray: (WallHotspot | EventHotspot | AlertHotspot)[] = [];
        const factory = new HotspotFactory();
        data.forEach((entry: any) => {
            const formedData = { ...entry };

            formedData.author = authors.find((v, __, ___) => v.id === formedData.authorId);
            delete formedData.authorId;

            hotspotsArray.push(factory.build(formedData));
        });
        return hotspotsArray;
    }

    public async findById(id: string): Promise<WallHotspot | EventHotspot | AlertHotspot> {
        let hotspot: WallHotspot | EventHotspot | AlertHotspot;

        const data = this.orm.hotspot.findOne(this.buildRequestBySlugOrId(id));
        const authorsId = [new CityzenId(data.authorId)];

        const author = (await this.ormCityzen.getAllAuthors(this.postgre, authorsId))[0];
        const factory = new HotspotFactory();
        if (data) {
            const formedData = { ...data };

            formedData.author = author;
            delete formedData.authorId;

            hotspot = factory.build(formedData);
        }
        return hotspot;
    }

    public isSet(id: string): boolean {
        const data = this.orm.hotspot.findOne(this.buildRequestBySlugOrId(id));
        return !!data;
    }

    public async findInArea(
        north: number,
        west: number,
        south: number,
        east: number,
    ): Promise<(WallHotspot | EventHotspot | AlertHotspot)[]> {
        const data = this.orm.hotspot.findAll({
            byArea: [north, west, south, east],
            removed: false,
        });

        const authorsId = Array.from(
            new Set(data.map((entry: any) => new CityzenId(entry.authorId))),
        );

        const authors = await this.ormCityzen.getAllAuthors(this.postgre, authorsId);

        const hotspotsArray: (WallHotspot | EventHotspot | AlertHotspot)[] = [];
        const factory = new HotspotFactory();
        data.forEach((entry: any) => {
            const formedData = { ...entry };

            formedData.author = authors.find((v, __, ___) => v.id === formedData.authorId);
            delete formedData.authorId;

            hotspotsArray.push(factory.build(entry));
        });
        return hotspotsArray;
    }

    public store<T extends Hotspot>(hotspot: T): void {
        const dataToSave = JSON.parse(JSON.stringify(hotspot));
        dataToSave.removed = false;
        this.orm.hotspot.save(dataToSave);
    }

    public update<T extends Hotspot>(hotspot: T): void {
        this.orm.hotspot.update(JSON.parse(JSON.stringify(hotspot)));
    }

    public remove(hotspotId: string): void {
        this.orm.hotspot.remove(hotspotId);
    }

    public cacheAlgolia<T extends Hotspot>(hotspot: T, v: boolean): void {
        this.orm.hotspot.cacheAlgolia(hotspot.id, v);
    }

    private buildRequestBySlugOrId = (id: string) => {
        const isId = isUuid(id);
        if (isId) {
            return {
                id,
                removed: false,
            };
        }
        return {
            slug: id,
            removed: false,
        };
    };
}

export default HotspotRepositoryInMemory;
