import { hasCommentAfterPosition } from 'tslint/lib';
import Hotspot from '../domain/cityLife/model/hotspot/Hotspot';
import Position from '../domain/cityLife/model/hotspot/Position';
import IHotspotRepository from '../domain/cityLife/model/hotspot/IHotspotRepository';
const hotspotCollection = require('./dbInMemory').hotspotCollection;
const cityzenCollection = require('./dbInMemory').cityzenCollection;


class HotspotRepositoryInMemory implements IHotspotRepository{
    
    protected hotspots : Map<string, Hotspot> = new Map();
    
    public findByCodeCommune(insee: string): Hotspot[] {
        const hotspotsResults : any = hotspotCollection.find({ idCity: insee });
        const authorIds = hotspotsResults.map((hotspot : any) => hotspot.id);
        const cityzensList = cityzenCollection.find({ insee: { $in : authorIds } });
    }

    public findById(id: string): Hotspot {
        return this.hotspots.get(id);
    }
    public findInArea(north : number, west : number, south : number, east : number): Hotspot[] {
        const topLeft : Position = new Position(north, west);
        const bottomRight : Position = new Position(south, east);
        return Array
        .from(this.hotspots)
        .map((tuple) => {
            return tuple[1];
        })
        .filter((hotspot) => {
            return hotspot.position.latitude <= topLeft.latitude &&
            hotspot.position.latitude >= bottomRight.latitude &&
            hotspot.position.longitude >= topLeft.longitude &&
            hotspot.position.longitude <= bottomRight.longitude;
        });
    }
    public store(hotspot: Hotspot): void {
        this.hotspots.set(hotspot.id, hotspot);
    }
    public remove(hotspot: Hotspot): void {
        this.hotspots.delete(hotspot.id);
    }

}
const hotspotRepositoryInMemory : HotspotRepositoryInMemory = new HotspotRepositoryInMemory();

export { HotspotRepositoryInMemory };
export default hotspotRepositoryInMemory;
