import SlackWebhook from '../api/libs/SlackWebhook';
import { format } from 'util';
import WallHotspot from '../domain/cityLife/model/hotspot/WallHotspot';
import EventHotspot from '../domain/cityLife/model/hotspot/EventHotspot';
import HotspotTitle from '../domain/cityLife/model/hotspot/HotspotTitle';
import AlertHotspot from '../domain/cityLife/model/hotspot/AlertHotspot';
import AlertMessage from '../domain/cityLife/model/hotspot/AlertMessage';
import EventDescription from '../domain/cityLife/model/hotspot/EventDescription';
import {
    HotspotIconType,
    HotspotScope,
    HotspotType,
} from '../domain/cityLife/model/hotspot/Hotspot';
import MediaBuilder from '../domain/cityLife/factories/MediaBuilder';
import HotspotBuilder from '../domain/cityLife/factories/HotspotBuilder';
import HotspotId from '../domain/cityLife/model/hotspot/HotspotId';
import CityId from '../domain/cityLife/model/city/CityId';
import Author from '../domain/cityLife/model/author/Author';
import Position from '../domain/cityLife/model/hotspot/Position';
import ViewsCount from '../domain/cityLife/model/hotspot/ViewsCount';
import Address from '../domain/cityLife/model/hotspot/Address';
import config from '../api/config/';
import { v4 } from 'uuid';
import { InvalidArgumentError } from 'restify-errors';
import {
    requiredWallHotspotProperties,
    requiredEventHotspotProperties,
    requiredAlertHotspotProperties,
} from '../api/requestValidation/createHotspotsSchema';
import { HOTSPOT_INITIAL_VIEWS } from '../domain/cityLife/constants';
import HotspotSlug from './../domain/cityLife/model/hotspot/HotspotSlug';
import MemberList from '../domain/cityLife/model/hotspot/MemberList';
const request = require('request');
const slug = require('slug');

export const HOTSPOT_ID_FOR_TEST = 'fake-hotspot-id';

class HotspotFactory {
    public build = (data: any): WallHotspot | EventHotspot | AlertHotspot => {
        if (data.type === HotspotType.WallMessage) {
            this.throwErrorIfRequiredAndUndefined(data, requiredWallHotspotProperties);
            return this.createWallHotspot(data);
        }
        if (data.type === HotspotType.Event) {
            this.throwErrorIfRequiredAndUndefined(data, requiredEventHotspotProperties);
            return this.createEventHotspot(data);
        }
        if (data.type === HotspotType.Alert) {
            this.throwErrorIfRequiredAndUndefined(data, requiredAlertHotspotProperties);
            return this.createAlertHotspot(data);
        }
    };

    private createWallHotspot = (data: any): WallHotspot => {
        return new WallHotspot(this.createHotspotBuilder(data), this.createMediaBuilder(data));
    };

    private createEventHotspot = (data: any): EventHotspot => {
        let dateEnd: Date;
        let description: EventDescription;

        if (data && data.dateEnd) {
            dateEnd = new Date(data.dateEnd);
        }
        // data from db
        if (data && data.description.content) {
            const content = data.description.content;
            const updatedAt = data.description.updatedAt;
            description = new EventDescription(content, updatedAt);
        }
        // data from http POST request
        if (data && data.description && typeof data.description === 'string') {
            description = new EventDescription(data.description);
        }

        return new EventHotspot(
            this.createHotspotBuilder(data),
            this.createMediaBuilder(data),
            dateEnd,
            description,
        );
    };

    private createAlertHotspot = (data: any): AlertHotspot => {
        let message: AlertMessage;

        // data from database
        if (data && data.message.content) {
            message = new AlertMessage(data.message.content, data.message.updatedAt);
        }
        // data from http POST request
        if (data && typeof data.message === 'string') {
            message = new AlertMessage(data.message);
        }
        return new AlertHotspot(this.createHotspotBuilder(data), message);
    };

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
            position = new Position(data.position.latitude, data.position.longitude);
        }
        // data from both database or user
        if (data.address) {
            address = new Address(data.address.name, data.address.city);
        }
        // data from both database or user
        if (data.cityzen) {
            author = new Author(data.cityzen.pseudo, data.cityzen.id);
        } else if (data.author) {
            author = data.author;
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
        try {
            type = this.setType(data.type);
            icon = this.setIconType(data.iconType);
        } catch (error) {
            const hook = new SlackWebhook({ url: config.slack.slackWebhookErrorUrl }, request);
            hook.alert(
                `${error.message} in hotspot factory \n
                data provided: ${JSON.stringify(data)}`,
            );
            throw new InvalidArgumentError(error.message);
        }

        return new HotspotBuilder(hotspotId, position, author, cityId, address, views, type, icon);
    };

    private setIconType = (iconType: any) => {
        if (
            iconType === HotspotIconType.Wall ||
            iconType === HotspotIconType.Event ||
            iconType === HotspotIconType.Accident ||
            iconType === HotspotIconType.Destruction ||
            iconType === HotspotIconType.Handicap ||
            iconType === HotspotIconType.RoadWorks
        ) {
            return iconType;
        }
        throw new InvalidArgumentError('Unknow Hotspot iconType');
    };

    private setType = (hotspotType: any) => {
        if (
            hotspotType === HotspotType.WallMessage ||
            hotspotType === HotspotType.Event ||
            hotspotType === HotspotType.Alert
        ) {
            return hotspotType;
        }
        throw new InvalidArgumentError('Unknow Hotspot type');
    };

    private createMediaBuilder = (data: any) => {
        let hotspotTitle: HotspotTitle;
        let hotspotSlug: HotspotSlug;
        let scope: HotspotScope;
        const members = new MemberList();
        if (data.title) {
            hotspotTitle = new HotspotTitle(data.title);
            hotspotSlug = new HotspotSlug(slug(data.title + ' ' + v4().slice(0, 4)));
        }
        if (data.slug) {
            hotspotSlug = new HotspotSlug(data.slug);
        }
        if (data.scope) {
            scope = data.scope === HotspotScope.Public ? HotspotScope.Public : HotspotScope.Private;
        }
        if (data.members) {
            data.members.forEach((m: string) => {
                members.add(m);
            });
        }
        return new MediaBuilder(hotspotTitle, hotspotSlug, scope, members);
    };

    private throwErrorIfRequiredAndUndefined = (data: any, requiredProperties: string[]) => {
        const errorMessage = '%s must be provided to HotspotFactory';
        requiredProperties.forEach(prop => {
            if (!data || !data[prop]) {
                const hook = new SlackWebhook({ url: config.slack.slackWebhookErrorUrl }, request);
                hook.alert(
                    `Property ${prop} is undefined in hotspot factory \n
                    data provided: ${JSON.stringify(data)}`,
                );
                throw new InvalidArgumentError(format(errorMessage, prop));
            }
        });
    };
}
export default HotspotFactory;
