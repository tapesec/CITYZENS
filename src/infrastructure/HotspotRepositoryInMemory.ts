import WallHotspot from '../domain/cityLife/model/hotspot/WallHotspot';
import EventHotspot from '../domain/cityLife/model/hotspot/EventHotspot';
import AlertHotspot from '../domain/cityLife/model/hotspot/AlertHotspot';
import HotspotFactory from './HotspotFactory';
import Hotspot from '../domain/cityLife/model/hotspot/Hotspot';
import IHotspotRepository from '../domain/cityLife/model/hotspot/IHotspotRepository';

class HotspotRepositoryInMemory implements IHotspotRepository{

    protected hotspots : Map<string, Hotspot> = new Map();

    constructor(protected orm : any) {
    }

    public findByCodeCommune = (insee: string): (WallHotspot|EventHotspot|AlertHotspot)[] => {
        const data = this.orm.hotspot.findAll({ cityId: insee, removed: false });
        const hotspotsArray: (WallHotspot|EventHotspot|AlertHotspot)[] = [];
        data.forEach((entry : any) => {
            hotspotsArray.push(new HotspotFactory().build(entry));
        });
        return hotspotsArray;
    }

    public findById = (id: string): WallHotspot|EventHotspot|AlertHotspot => {
        let hotspot: WallHotspot|EventHotspot|AlertHotspot;
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
    : (WallHotspot|EventHotspot|AlertHotspot)[] => {
        const data = this.orm.hotspot.findAll({
            byArea: [north, west, south, east],
            removed: false,
        });
        const hotspotsArray: (WallHotspot|EventHotspot|AlertHotspot)[] = [];
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

    public cacheAlgolia<T extends Hotspot>(hotspot: T, v = true): void {
        this.orm.hotspot.cacheAlgolia(hotspot.id, v);
    }
}

export default HotspotRepositoryInMemory;
