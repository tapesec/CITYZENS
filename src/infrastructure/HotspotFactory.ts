import Author from '../domain/cityLife/model/author/Author';
import Content from '../domain/cityLife/model/hotspot/Content';
import Position from '../domain/cityLife/model/hotspot/Position';
import Hotspot, { HotspotScope } from '../domain/cityLife/model/hotspot/Hotspot';
import Address from '../domain/cityLife/model/hotspot/Address';
import config from './../../src/api/config/';
import { v4 } from 'uuid';

export const HOTSPOT_ID_FOR_TEST = 'fake-hotspot-id';

class HotspotFactory {

    public createHotspot = (data : any) : Hotspot => {
        let position : Position;
        let content : Content;
        let address : Address;
        let author : Author;
        let hotspot : Hotspot;
        let scope : HotspotScope;
        let idCity : string;

        // data from both database or user
        if (data.position) {
            position = new Position(data.position.latitude, data.position.longitude);
        }
        // data from both database or user
        if (data.address) {
            address = new Address(data.address.name, data.address.city);
        }
        // data from both database or user
        if (data.cityzen) {
            author = new Author(data.cityzen.pseudo, data.cityzen.id);
        }
        if (data.scope) {
            scope = data.scope === 'public' ? HotspotScope.Public : HotspotScope.Private;
        }
        if (!data.id) data.id = v4();

        if (data.idCity) {
            idCity = data.idCity;
        } else if (data.id_city) {
            idCity = data.id_city;
        }

        hotspot = new Hotspot(
            data.id, data.title, position, author, idCity, address, scope);

        return hotspot;
    }
}
export default HotspotFactory;
