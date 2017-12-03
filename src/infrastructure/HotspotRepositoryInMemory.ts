import HotspotFactory from './HotspotFactory';
import Hotspot from '../domain/cityLife/model/hotspot/Hotspot';
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
        const data = this.orm.hotspot.findAll({ idCity: insee });
        const hotspotsArray : Hotspot[] = [];
        data.forEach((entry : any) => {
            hotspotsArray.push(new HotspotFactory().createHotspot(entry));
        });
        return hotspotsArray;
    }

    public findById = (id: string): Hotspot => {
        let hotspot : Hotspot;
        const data = this.orm.hotspot.findOne({ id });
        if (data) {
            hotspot = new HotspotFactory().createHotspot(data);
        }
        return hotspot;
    }

    public isSet(id: string): boolean {
        const data = this.orm.hotspot.findOne({ id });
        return !!data;
    }

    public findInArea = (north : number, west : number, south : number, east : number)
    : Hotspot[] => {
        const data = this.orm.hotspot.findAll({ byArea: [north, west, south, east] });
        const hotspotsArray : Hotspot[] = [];
        data.forEach((entry : any) => {
            hotspotsArray.push(new HotspotFactory().createHotspot(entry));
        });
        return hotspotsArray;
    }

    public store(hotspot: Hotspot): void {
        this.orm.hotspot.save(JSON.parse(JSON.stringify(hotspot)));
    }
    public remove(hotspot: Hotspot): void {
        this.orm.hotspot.remove(hotspot.id);
    }

}
const hotspotRepositoryInMemory : HotspotRepositoryInMemory =
new HotspotRepositoryInMemory(orm);

export { HotspotRepositoryInMemory };
export default hotspotRepositoryInMemory;
