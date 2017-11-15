import * as hotspotFactory from './HotspotFactory';
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
            hotspotsArray.push(hotspotFactory.createHotspot(entry));
        });
        return hotspotsArray;
    }

    public findById = (id: string): Hotspot => {
        let hotspot : Hotspot;
        const data = this.orm.hotspot.findOne({ id });
        if (data) {
            hotspot = hotspotFactory.createHotspot(data);
        }
        return hotspot;
    }

    public findInArea = (north : number, west : number, south : number, east : number)
    : Hotspot[] => {
        const topLeft : Position = new Position(north, west);
        const bottomRight : Position = new Position(south, east);
        const data = this.orm.hotspot.findAll((obj : any) => {
            return (
                obj.position.latitude < topLeft.latitude &&
                obj.position.latitude > bottomRight.latitude &&
                obj.position.longitude > topLeft.longitude &&
                obj.position.longitude < bottomRight.longitude
            );
        });
        const hotspotsArray : Hotspot[] = [];
        data.forEach((entry : any) => {
            hotspotsArray.push(hotspotFactory.createHotspot(entry));
        });
        return hotspotsArray;
    }

    public store(hotspot: Hotspot): void {
        this.hotspots.set(hotspot.id, hotspot);
    }
    public remove(hotspot: Hotspot): void {
        this.hotspots.delete(hotspot.id);
    }

}
const hotspotRepositoryInMemory : HotspotRepositoryInMemory = new HotspotRepositoryInMemory(orm);

export { HotspotRepositoryInMemory };
export default hotspotRepositoryInMemory;
