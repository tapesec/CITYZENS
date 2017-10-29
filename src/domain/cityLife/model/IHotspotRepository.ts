import Hotspot from './Hotspot';
import Position from './Position';

interface IHotspotRepository​​ {

    findById(id : string) : Hotspot;

    findInArea(north : number, west : number, south : number, east : number) : Hotspot[];

    store(hotspot : Hotspot) : void;

    remove(hotspot : Hotspot) : void;
}

export default IHotspotRepository;
