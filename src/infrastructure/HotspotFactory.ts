import ViewsCount from '../domain/cityLife/model/hotspot/ViewsCount';
import SlackWebhook from '../api/libs/SlackWebhook';
import { format } from 'util';
import HotspotTitle from '../domain/cityLife/model/hotspot/HotspotTitle';
import MediaBuilder from '../domain/cityLife/factories/MediaBuilder';
import CityId from '../domain/cityLife/model/city/CityId';
import HotspotId from '../domain/cityLife/model/hotspot/HotspotId';
import HotspotBuilder from '../domain/cityLife/factories/HotspotBuilder';
import WallHotspot from '../domain/cityLife/model/hotspot/WallHotspot';
import EventHotspot from '../domain/cityLife/model/hotspot/EventHotspot';
import EventDescription from '../domain/cityLife/model/hotspot/EventDescription';
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
import {
    requiredWallHotspotProperties,
    requiredEventHotspotProperties,
} from '../api/requestValidation/createHotspotsSchema';
import { HOTSPOT_INITIAL_VIEWS } from '../domain/cityLife/constants';
const request = require('request');

export const HOTSPOT_ID_FOR_TEST = 'fake-hotspot-id';

class HotspotFactory {

    public build = (data: any): Hotspot => {

        if (data.type === HotspotType.WallMessage) {
            this.throwErrorIfRequiredAndUndefined(data, requiredWallHotspotProperties);
            return this.createWallHotspot(data);
        }
        if (data.type === HotspotType.Event) {
            this.throwErrorIfRequiredAndUndefined(data, requiredEventHotspotProperties);
            return this.createEventHotspot(data);
        }

    }

    private createWallHotspot = (data: any): WallHotspot => {
        return new WallHotspot(this.createHotspotBuilder(data), this.createMediaBuilder(data));
    }

    private createEventHotspot = (data: any): EventHotspot => {
        let dateEnd: Date;
        let description: EventDescription;

        if (data && data.dateEnd) {
            dateEnd = new Date(data.dateEnd);
        }
        if (data && data.description) {
            description = new EventDescription(data.description);
        }
        return new EventHotspot(
            this.createHotspotBuilder(data), this.createMediaBuilder(data), dateEnd, description);
    }

    private createHotspotBuilder = (data: any): HotspotBuilder => {
        let hotspotId: HotspotId;
        let position: Position;
        let address: Address;
        let author: Author;
        let cityId: CityId;
        let views: ViewsCount;
        let type: HotspotType;
        let icon: HotspotIconType;
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
        if (data.type === HotspotType.WallMessage) {
            type = HotspotType.WallMessage;
            icon = HotspotIconType.Wall;
        }
        if (data.type === HotspotType.Event) {
            type = HotspotType.Event;
            icon = HotspotIconType.Event;
        }

        return new HotspotBuilder(
            hotspotId,
            position,
            author,
            cityId,
            address,
            views,
            type,
            icon);
    }

    private createMediaBuilder = (data: any) => {
        let hotspotTitle: HotspotTitle;
        let scope: HotspotScope;
        if (data.title) {
            hotspotTitle = new HotspotTitle(data.title);
        }
        if (data.scope) {
            scope = data.scope === HotspotScope.Public ?
            HotspotScope.Public : HotspotScope.Private;
        }
        return new MediaBuilder(hotspotTitle, scope);
    }

    private throwErrorIfRequiredAndUndefined = (data: any, requiredProperties: string[]) => {

        const errorMessage = '%s must be provided to HotspotFactory';
        requiredProperties.forEach((prop) => {
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
