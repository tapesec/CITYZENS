import { hasCommentAfterPosition } from 'tslint/lib';
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
        const data = this.orm.hotspot.findOne({ id });
        return hotspotFactory.createHotspot(data);
    }

    public findInArea = (
        north : number, west : number, south : number, east : number): Hotspot[] => {
        const topLeft : Position = new Position(north, west);
        const bottomRight : Position = new Position(south, east);
        console.log(topLeft, bottomRight);
        const data = this.orm.hotspot.findAll({
            'position.latitude': {
                $lte: topLeft.latitude,
            },
            'position.latitude': {
                $gte: bottomRight.latitude,
            },
            'position.longitude': {
                $gte: topLeft.longitude,
            },
            'position.longitude': {
                
                $lte: bottomRight.longitude,
            },
        });
        /*
        var tyrfing = items.where(function(obj) {
  	return (
      obj.position.latitude < 44.84966239 && 
      obj.position.latitude > 44.83216522 && 
      obj.position.longitude < -0.75003147 &&
      obj.position.longitude > -0.79135895 
      
    );
})
        */
        console.log(data);
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
