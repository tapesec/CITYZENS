import Hotspot from '../domain/cityLife/model/Hotspot';
import Position from '../domain/cityLife/model/Position';
import IHotspotRepository from '../domain/cityLife/model/IHotspotRepository';


class HotspotRepositoryInMemory implements IHotspotRepository{
    
    protected hotspots : Map<string, Hotspot> = new Map();
    
    public findByCodeCommune(insee: string): Hotspot[] {
        return Array.from(this.hotspots.values()).filter(value => value.idCity === insee);
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
