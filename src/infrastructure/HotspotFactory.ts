import { format } from 'util';
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

    public build = (data: any): Hotspot => {

        this.throwErrorIfRequiredAndUndefined(data);

        if (data.type === HotspotType.WallMessage) {
            return this.createWallHotspot(data);
        }

    }

    private createWallHotspot = (data: any) : WallHotspot => {
        let hotspotId: HotspotId;
        let hotspotTitle: HotspotTitle;
        let position: Position;
        let address: Address;
        let author: Author;
        let wallHotspot: WallHotspot;
        let scope: HotspotScope;
        let cityId: CityId;

        if (data.title) {
            hotspotTitle = new HotspotTitle(data.title);
        }

        // data from both database or user
        if (data.position) {
            position = new Position(data.position.latitude,data.position.longitude);
        }
        // data from both database or user
        if (data.address) {
            address = new Address(data.address.name,data.address.city);
        }
        // data from both database or user
        if (data.cityzen) {
            author = new Author(data.cityzen.pseudo,data.cityzen.id);
        }
        if (data.scope) {
            scope = data.scope === HotspotScope.Public ?
            HotspotScope.Public : HotspotScope.Private;
        }
        if (!data.id) {
            hotspotId = new HotspotId(v4());
        } else {
            hotspotId = new HotspotId(data.id);
        }
        if (data.cityId) {
            cityId = new CityId(data.cityId);
        } else if (data.city_id) {
            cityId = new CityId(data.city_id);
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

    private throwErrorIfRequiredAndUndefined = (data: any) => {

        const errorMessage = '%s msut be provided to HotspotFactory';

        ['position', 'title', 'scope', 'city_id', 'type', 'icon_type', 'cityzen'].forEach((prop) => {
            if (!data[prop]) {
                throw new InvalidArgumentError(format(errorMessage, prop));
            }
        });
    }
}
export default HotspotFactory;
