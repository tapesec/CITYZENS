import SlackWebhook from '../api/libs/SlackWebhook';
import { format } from 'util';
import HotspotTitle from '../domain/cityLife/model/hotspot/HotspotTitle';
import AlertHotspot from '../domain/cityLife/model/hotspot/AlertHotspot';
import AlertMessage from '../domain/cityLife/model/hotspot/AlertMessage';
import {
    HotspotIconType,
    HotspotScope,
    HotspotType,
} from '../domain/cityLife/model/hotspot/Hotspot';
import MediaBuilder from '../domain/cityLife/factories/MediaBuilder';
import HotspotBuilder from '../domain/cityLife/factories/HotspotBuilder';
import HotspotId from '../domain/cityLife/model/hotspot/HotspotId';
import CityId from '../domain/cityLife/model/city/CityId';
import Author from './../domain/cityLife/model/author/Author';
import Position from '../domain/cityLife/model/hotspot/Position';
import ViewsCount from '../domain/cityLife/model/hotspot/ViewsCount';
import Address from '../domain/cityLife/model/hotspot/Address';
import config from '../api/config/';
import { v4 } from 'uuid';
import { InvalidArgumentError } from 'restify-errors';
import {
    requiredMediaHotspotProperties,
    requiredAlertHotspotProperties,
} from '../api/requestValidation/createHotspotsSchema';
import { HOTSPOT_INITIAL_VIEWS } from '../domain/cityLife/constants';
import HotspotSlug from './../domain/cityLife/model/hotspot/HotspotSlug';
import MemberList from '../domain/cityLife/model/hotspot/MemberList';
import VoterList from '../domain/cityLife/model/hotspot/VoterList';
import PertinenceScore from '../domain/cityLife/model/hotspot/PertinenceScore';
import CityzenId from '../domain/cityzens/model/CityzenId';
import AvatarIconUrl from '../domain/cityLife/model/hotspot/AvatarIconUrl';
import ImageLocation from '../domain/cityLife/model/hotspot/ImageLocation';
import SlideShow from '../domain/cityLife/model/hotspot/SlideShow';
import MediaHotspot from '../domain/cityLife/model/hotspot/MediaHotspot';
const request = require('request');
const slug = require('slug');

export const HOTSPOT_ID_FOR_TEST = 'fake-hotspot-id';

class HotspotFactory {
    public build = (data: any): MediaHotspot | AlertHotspot => {
        if (data.type === HotspotType.Media) {
            this.throwErrorIfRequiredAndUndefined(data, requiredMediaHotspotProperties);
            return this.createMediaHotspot(data);
        }
        if (data.type === HotspotType.Alert) {
            this.throwErrorIfRequiredAndUndefined(data, requiredAlertHotspotProperties);
            return this.createAlertHotspot(data);
        }
    };

    private createMediaHotspot = (data: any): MediaHotspot => {
        return new MediaHotspot(this.createHotspotBuilder(data), this.createMediaBuilder(data));
    };

    private createAlertHotspot = (data: any): AlertHotspot => {
        let message: AlertMessage;
        let voterList = new VoterList();
        let pertinenceScore: PertinenceScore;
        let imageLocation: ImageLocation;

        // data from database
        if (data && data.message.content) {
            message = new AlertMessage(data.message.content, data.message.updatedAt);
            if (data.voterList) {
                data.voterList.forEach((currentVote: any, currentIndex: any) => {
                    voterList.add(new CityzenId(currentVote[0]), currentVote[1]);
                });
            }
            if (data.pertinence !== undefined) {
                pertinenceScore = new PertinenceScore(
                    data.pertinence.agree,
                    data.pertinence.disagree,
                );
            } else {
                pertinenceScore = new PertinenceScore(0, 0);
            }
            if (data.imageDescriptionLocation) {
                imageLocation = new ImageLocation(data.imageDescriptionLocation);
            }
        }
        // data from http POST request
        if (data && typeof data.message === 'string') {
            message = new AlertMessage(data.message);
            voterList = new VoterList();
            imageLocation = new ImageLocation();
            pertinenceScore = new PertinenceScore(0, 0);
        }
        return new AlertHotspot(
            this.createHotspotBuilder(data),
            message,
            imageLocation,
            pertinenceScore,
            voterList,
        );
    };

    private createHotspotBuilder = (data: any): HotspotBuilder => {
        let hotspotId: HotspotId;
        let position: Position;
        let address: Address;
        let author: Author;
        let cityId: CityId;
        let views: ViewsCount;
        let createdAt: Date;
        let avatarIconUrl: AvatarIconUrl;

        try {
            this.assertType(data.type);
            this.assertIconType(data.iconType);
        } catch (error) {
            const hook = new SlackWebhook({ url: config.slack.slackWebhookErrorUrl }, request);
            hook.alert(
                `${error.message} in hotspot factory \n
            data provided: ${JSON.stringify(data)}`,
            );
            throw new InvalidArgumentError(error.message);
        }

        // data from both database or user
        if (data.position) {
            position = new Position(data.position.latitude, data.position.longitude);
        }
        // data from both database or user
        if (data.address) {
            address = new Address(data.address.name, data.address.city);
        }
        if (data.createdAt) {
            createdAt = new Date(data.createdAt);
        }

        if (data.cityzen) {
            // Data from user
            author = new Author(data.cityzen.pseudo, data.cityzen.id);
        } else {
            // Data from loki
            author = new Author(data.author.pseudo, new CityzenId(data.author.id));
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

        if (!data.avatarIconUrl) {
            switch (data.type) {
                case HotspotType.Media:
                    avatarIconUrl = new AvatarIconUrl(config.avatarIcon.defaultMediaIcon);
                    break;
                case HotspotType.Alert:
                    avatarIconUrl = new AvatarIconUrl(config.avatarIcon.defaultAlertIcon);
                    break;
                default:
                    throw new Error('Unknow type: ' + data.type);
            }
        } else {
            avatarIconUrl = new AvatarIconUrl(data.avatarIconUrl);
        }

        return new HotspotBuilder(
            hotspotId,
            position,
            author,
            cityId,
            address,
            views,
            data.type as HotspotType,
            data.iconType as HotspotIconType,
            createdAt,
            avatarIconUrl,
        );
    };

    private assertIconType = (iconType: string) => {
        if (
            !(
                iconType === HotspotIconType.Wall ||
                iconType === HotspotIconType.Event ||
                iconType === HotspotIconType.Accident ||
                iconType === HotspotIconType.Destruction ||
                iconType === HotspotIconType.Handicap ||
                iconType === HotspotIconType.RoadWorks
            )
        ) {
            throw new InvalidArgumentError('Unknow Hotspot iconType');
        }
    };

    private assertType = (hotspotType: string) => {
        if (!(hotspotType === HotspotType.Media || hotspotType === HotspotType.Alert)) {
            throw new InvalidArgumentError('Unknow Hotspot type');
        }
    };

    private createMediaBuilder = (data: any) => {
        let hotspotTitle: HotspotTitle;
        let hotspotSlug: HotspotSlug;
        let scope: HotspotScope;
        let slideShow = new SlideShow();
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
                members.add(new CityzenId(m));
            });
        }

        if (data.slideShow) {
            slideShow = new SlideShow(data.slideShow.map((x: string) => new ImageLocation(x)));
        }
        return new MediaBuilder(hotspotTitle, hotspotSlug, scope, members, slideShow);
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
