import { InvalidArgumentError } from 'restify-errors';
import { format } from 'util';
import { v4 } from 'uuid';
import config from '../api/config/';
import SlackWebhook from '../api/libs/SlackWebhook';
import {
    requiredAlertHotspotProperties,
    requiredMediaHotspotProperties,
} from '../api/requestValidation/createHotspotsSchema';
import { HOTSPOT_INITIAL_VIEWS } from '../domain/constants';
import HotspotBuilder from '../domain/factories/HotspotBuilder';
import MediaBuilder from '../domain/factories/MediaBuilder';
import CityId from '../domain/model/CityId';
import Address from '../domain/model/Address';
import AlertHotspot from '../domain/model/AlertHotspot';
import AlertMessage from '../domain/model/AlertMessage';
import AvatarIconUrl from '../domain/model/AvatarIconUrl';
import { HotspotScope, HotspotType } from '../domain/model/Hotspot';
import HotspotId from '../domain/model/HotspotId';
import HotspotTitle from '../domain/model/HotspotTitle';
import ImageLocation from '../domain/model/ImageLocation';
import MediaHotspot from '../domain/model/MediaHotspot';
import MemberList from '../domain/model/MemberList';
import PertinenceScore from '../domain/model/PertinenceScore';
import Position from '../domain/model/Position';
import SlideShow from '../domain/model/SlideShow';
import ViewsCount from '../domain/model/ViewsCount';
import VoterList from '../domain/model/VoterList';
import Cityzen from '../domain/model/Cityzen';
import CityzenId from '../domain/model/CityzenId';
import Author from '../domain/model/Author';
import HotspotSlug from '../domain/model/HotspotSlug';
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
        let pictureDescription: ImageLocation;

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
        }
        // data from http POST request
        if (data && typeof data.message === 'string') {
            message = new AlertMessage(data.message, new Date());
            voterList = new VoterList();
            pertinenceScore = new PertinenceScore(0, 0);
        }

        pictureDescription = new ImageLocation(data.pictureDescription);

        return new AlertHotspot(
            this.createHotspotBuilder(data),
            message,
            pictureDescription,
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
        } else {
            createdAt = new Date();
        }

        if (data.cityzen) {
            const cityzen = data.cityzen as Cityzen;
            // Data from user
            author = new Author(
                cityzen.pseudo,
                cityzen.id,
                cityzen.pictureExtern,
                cityzen.pictureCityzen,
            );
        } else {
            // Data from db
            author = new Author(
                data.author.pseudo,
                new CityzenId(data.author.id),
                new ImageLocation(data.author.pictureExtern),
                new ImageLocation(data.author.pictureCityzen),
            );
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
            createdAt,
            avatarIconUrl,
        );
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
