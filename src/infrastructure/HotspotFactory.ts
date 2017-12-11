import HotspotTitle from '../domain/cityLife/model/hotspot/HotspotTitle';
import MediaBuilder from '../domain/cityLife/factories/MediaBuilder';
import CityId from '../domain/cityLife/model/city/CityId';
import HotspotId from '../domain/cityLife/model/hotspot/HotspotId';
import HotspotBuilder from '../domain/cityLife/factories/HotspotBuilder';
import WallHotspot from '../domain/cityLife/model/hotspot/WallHotspot';
import Author from '../domain/cityLife/model/author/Author';
import Position from '../domain/cityLife/model/hotspot/Position';
import Hotspot, {
    HotspotIconType,
    HotspotScope,
    HotspotType,
} from '../domain/cityLife/model/hotspot/Hotspot';
import Address from '../domain/cityLife/model/hotspot/Address';
import config from './../../src/api/config/';
import { v4 } from 'uuid';
import { InvalidArgumentError } from 'restify-errors';

export const HOTSPOT_ID_FOR_TEST = 'fake-hotspot-id';

class HotspotFactory {

    constructor(private data: any) {
        if (!data || !data.type) {
            throw new InvalidArgumentError('args provided to HotspotFactory are not complete');
        }
    }

    public build = (): Hotspot => {
        if (this.data.type === HotspotType.WallMessage) {
            return this.createWallHotspot();
        }
    }

    public createWallHotspot = () : WallHotspot => {
        let hotspotId: HotspotId;
        let hotspotTitle: HotspotTitle;
        let position: Position;
        let address: Address;
        let author: Author;
        let wallHotspot: WallHotspot;
        let scope: HotspotScope;
        let cityId: CityId;

        if (this.data.title) {
            hotspotTitle = new HotspotTitle(this.data.title);
        }

        // data from boththis.database or user
        if (this.data.position) {
            position = new Position(this.data.position.latitude,this.data.position.longitude);
        }
        // data from boththis.database or user
        if (this.data.address) {
            address = new Address(this.data.address.name,this.data.address.city);
        }
        // data from boththis.database or user
        if (this.data.cityzen) {
            author = new Author(this.data.cityzen.pseudo,this.data.cityzen.id);
        }
        if (this.data.scope) {
            scope = this.data.scope === HotspotScope.Public ?
            HotspotScope.Public : HotspotScope.Private;
        }
        if (!this.data.id) {
            hotspotId = new HotspotId(v4());
        } else {
            hotspotId = new HotspotId(this.data.id);
        }
        if (this.data.cityId) {
            cityId = new CityId(this.data.cityId);
        } else if (this.data.city_id) {
            cityId = new CityId(this.data.city_id);
        }

        const hotspotBuilder = new HotspotBuilder(
            hotspotId,
            position,
            author,
            cityId,
            address,
            HotspotType.WallMessage,
            HotspotIconType.Wall);

        const mediaBuilder = new MediaBuilder(hotspotTitle, scope);

        wallHotspot = new WallHotspot(hotspotBuilder, mediaBuilder);
        return wallHotspot;
    }
}
export default HotspotFactory;
