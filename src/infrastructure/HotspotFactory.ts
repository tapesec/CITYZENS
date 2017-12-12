import ViewsCount from '../domain/cityLife/model/hotspot/ViewsCount';
import SlackWebhook from '../api/libs/SlackWebhook';
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
import config from '../api/config/';
import { v4 } from 'uuid';
import { InvalidArgumentError } from 'restify-errors';
import { createHospotSchemaRequiredProperties } from '../api/requestValidation/schema';
import { HOTSPOT_INITIAL_VIEWS } from '../domain/cityLife/constants';
const request = require('request');

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
        let views: ViewsCount;

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
        // new hotspot posted by user
        if (!data.id) {
            hotspotId = new HotspotId(v4());
        } else {
            hotspotId = new HotspotId(data.id);
        }
        if (data.cityId) {
            cityId = new CityId(data.cityId);
        }
        // new data posted by user
        if (!data.views) {
            views = new ViewsCount(HOTSPOT_INITIAL_VIEWS);
        } else {
            views = new ViewsCount(data.views);
        }

        const hotspotBuilder = new HotspotBuilder(
            hotspotId,
            position,
            author,
            cityId,
            address,
            views,
            HotspotType.WallMessage,
            HotspotIconType.Wall);

        const mediaBuilder = new MediaBuilder(hotspotTitle, scope);

        wallHotspot = new WallHotspot(hotspotBuilder, mediaBuilder);
        return wallHotspot;
    }

    private throwErrorIfRequiredAndUndefined = (data: any) => {

        const errorMessage = '%s must be provided to HotspotFactory';
        createHospotSchemaRequiredProperties.forEach((prop) => {
            if (!data || !data[prop]) {
                const hook = new SlackWebhook({ url: config.slack.slackWebhookErrorUrl }, request);
                hook.alert(
                    `Property ${prop} is undefined in hotspot factory \n
                    data provided: ${JSON.stringify(data)}`,
                );
                throw new InvalidArgumentError(format(errorMessage, prop));
            }
        });
    }
}
export default HotspotFactory;
