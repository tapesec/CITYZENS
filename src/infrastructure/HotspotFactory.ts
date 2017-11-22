import Author from '../domain/cityLife/model/author/Author';
import Content from '../domain/cityLife/model/hotspot/Content';
import Position from '../domain/cityLife/model/hotspot/Position';
import Hotspot, { HotspotScope } from '../domain/cityLife/model/hotspot/Hotspot';
import Address from '../domain/cityLife/model/hotspot/Address';

export const createHotspot = (data : any) : Hotspot => {
    let position : Position;
    let content : Content;
    let address : Address;
    let author : Author;
    let hotspot : Hotspot;
    let scope : HotspotScope;

    if (data.position) {
        position = new Position(data.position.latitude, data.position.longitude);
    }
    if (data.content) {
        content = new Content(
            data.content.message, 
            new Date(data.content.createdAt), 
            data.content.updatedAt ? new Date(data.content.updatedAt) : undefined, 
        );
    }
    if (data.address) {
        address = new Address(data.address.name, data.address.city);
    }
    if (data.cityzen) {
        author = new Author(data.cityzen.pseudo, data.cityzen.email);
    }
    if (data.scope) {
        scope = data.scope === 'public' ? HotspotScope.Public : HotspotScope.Private;
    }
    hotspot = new Hotspot(
        data.id, data.title, position, content, author, data.idCity, address, scope);

    return hotspot;

};