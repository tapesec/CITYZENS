import HotspotFactory from './HotspotFactory';
import Hotspot, { HotspotType } from '../domain/cityLife/model/hotspot/Hotspot';
import Position from '../domain/cityLife/model/hotspot/Position';
import IHotspotRepository from '../domain/cityLife/model/hotspot/IHotspotRepository';
import orm from './orm';

class HotspotRepositoryInMemory implements IHotspotRepository{

    protected hotspots : Map<string, Hotspot> = new Map();
    protected orm : any;

    constructor(orm : any) {
        this.orm = orm;
    }

    public findByCodeCommune = (insee: string): Hotspot[] => {
        const data = this.orm.hotspot.findAll({ cityId: insee, removed: false });
        const hotspotsArray : Hotspot[] = [];
        data.forEach((entry : any) => {
            hotspotsArray.push(new HotspotFactory().build(entry));
        });
        return hotspotsArray;
    }

    public findById = (id: string): Hotspot => {
        let hotspot : Hotspot;
        const data = this.orm.hotspot.findOne({ id, removed: false });
        if (data) {
            hotspot = new HotspotFactory().build(data);
        }
        return hotspot;
    }

    public isSet(id: string): boolean {
        const data = this.orm.hotspot.findOne({ id, removed: false });
        return !!data;
    }

    public findInArea = (north : number, west : number, south : number, east : number)
    : Hotspot[] => {
        const data = this.orm.hotspot.findAll({
            byArea: [north, west, south, east],
            removed: false,
        });
        const hotspotsArray : Hotspot[] = [];
        data.forEach((entry : any) => {
            hotspotsArray.push(new HotspotFactory().build(entry));
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

    public remove<T extends Hotspot>(hotspot: T): void {
        this.orm.hotspot.remove(hotspot.id);
    }

}
const hotspotRepositoryInMemory : HotspotRepositoryInMemory =
new HotspotRepositoryInMemory(orm);

export { HotspotRepositoryInMemory };
export default hotspotRepositoryInMemory;
