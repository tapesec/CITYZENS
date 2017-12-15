import WallHotspot from './WallHotspot';
import EventHotspot from './EventHotspot';
import AlertHotspot from './AlertHotspot';
import Hotspot from './Hotspot';
import Position from './Position';

interface IHotspotRepository​​ {

    findById(id : string): WallHotspot|EventHotspot|AlertHotspot;

    findInArea(north : number, west : number, south : number, east : number):
    (WallHotspot|EventHotspot|AlertHotspot)[];

    findByCodeCommune(insee : string): (WallHotspot|EventHotspot|AlertHotspot)[];

    isSet(id : string) : boolean;

    store(hotspot : Hotspot) : void;

    remove(hotspot : Hotspot) : void;
}

export default IHotspotRepository;
