const slug = require('slug');
import MessageSample from '../domain/cityLife/model/sample/MessageSample';
import WallHotspotSample from '../domain/cityLife/model/sample/WallHotspotSample';
import CitySample from '../domain/cityLife/model/sample/CitySample';
import AddressSample from '../domain/cityLife/model/sample/AddressSample';
import {
    HotspotScope,
    HotspotType,
    HotspotIconType,
} from '../domain/cityLife/model/hotspot/Hotspot';
const loki = require('lokijs');
import CityzenSample from '../domain/cityzens/model/CityzenSample';
import PositionSample from './../domain/cityLife/model/sample/PositionSample';
import { HOTSPOT_INITIAL_VIEWS } from '../domain/cityLife/constants';
import AlertHotspotSample from './../domain/cityLife/model/sample/AlertHotspotSample';
import EventHotspotSample from './../domain/cityLife/model/sample/EventHotspotSample';

let hotspotCollection: any;
let messageCollection: any;
let cityCollection: any;
let cityzenCollection: any;

export const HOTSPOT_MARTIGNAS_TOWNHALL = {
    id: WallHotspotSample.TOWNHALL.id,
    title: WallHotspotSample.TOWNHALL.title,
    position: JSON.parse(JSON.stringify(PositionSample.TOWNHALL)),
    authorId: JSON.parse(JSON.stringify(CityzenSample.ELODIE.id.toJson())),
    cityId: CitySample.MARTIGNAS.insee,
    slug: slug(WallHotspotSample.TOWNHALL.title),
    address: JSON.parse(JSON.stringify(AddressSample.TOWNHALL_ADDRESS)),
    views: HOTSPOT_INITIAL_VIEWS,
    scope: HotspotScope.Public,
    type: HotspotType.WallMessage,
    iconType: HotspotIconType.Wall,
    removed: false,
};
export const HOTSPOT_MARTIGNAS_CHURCH = {
    id: WallHotspotSample.CHURCH.id,
    title: WallHotspotSample.CHURCH.title,
    position: JSON.parse(JSON.stringify(PositionSample.CHURCH)),
    authorId: JSON.parse(JSON.stringify(CityzenSample.LOUISE.id.toJson())),
    slug: slug(WallHotspotSample.CHURCH.title),
    cityId: CitySample.MARTIGNAS.insee,
    address: JSON.parse(JSON.stringify(AddressSample.CHURCH_ADDRESS)),
    views: HOTSPOT_INITIAL_VIEWS,
    scope: HotspotScope.Public,
    type: HotspotType.WallMessage,
    iconType: HotspotIconType.Wall,
    removed: false,
};
export const HOTSPOT_MARTIGNAS_SCHOOL = {
    id: WallHotspotSample.SCHOOL.id,
    title: WallHotspotSample.SCHOOL.title,
    position: JSON.parse(JSON.stringify(PositionSample.SCHOOL)),
    authorId: JSON.parse(JSON.stringify(CityzenSample.ELODIE.id.toJson())),
    slug: slug(WallHotspotSample.SCHOOL.title),
    cityId: CitySample.MARTIGNAS.insee,
    address: JSON.parse(JSON.stringify(AddressSample.SCHOOL_ADDRESS)),
    views: HOTSPOT_INITIAL_VIEWS,
    scope: HotspotScope.Public,
    type: HotspotType.WallMessage,
    iconType: HotspotIconType.Wall,
    removed: false,
};
export const HOTSPOT_MERIGNAC_CENTER = {
    id: WallHotspotSample.MERIGNAC.id,
    title: WallHotspotSample.MERIGNAC.title,
    position: JSON.parse(JSON.stringify(PositionSample.MERIGNAC)),
    authorId: JSON.parse(JSON.stringify(CityzenSample.MARTIN.id.toJson())),
    slug: slug(WallHotspotSample.MERIGNAC.title),
    cityId: CitySample.MERIGNAC.insee,
    address: JSON.parse(JSON.stringify(AddressSample.RANDOM_MERIGNAC_ADDRESS)),
    views: HOTSPOT_INITIAL_VIEWS,
    scope: HotspotScope.Public,
    type: HotspotType.WallMessage,
    iconType: HotspotIconType.Wall,
    removed: false,
};

export const HOTSPOT_SIMCITY_TOEDIT = {
    id: WallHotspotSample.TOEDIT.id,
    title: WallHotspotSample.TOEDIT.title,
    position: JSON.parse(JSON.stringify(PositionSample.TOEDIT)),
    authorId: JSON.parse(JSON.stringify(CityzenSample.MARTIN.id.toJson())),
    slug: slug(WallHotspotSample.TOEDIT.title),
    cityId: CitySample.SIMCITY.insee,
    address: JSON.parse(JSON.stringify(AddressSample.TOEDIT_ADDRESS)),
    views: HOTSPOT_INITIAL_VIEWS,
    scope: HotspotScope.Private,
    type: HotspotType.WallMessage,
    iconType: HotspotIconType.Wall,
    removed: false,
};

export const ALERT_ACCIDENT = {
    id: AlertHotspotSample.ACCIDENT.id,
    message: AlertHotspotSample.ACCIDENT.message,
    position: JSON.parse(JSON.stringify(PositionSample.ACCIDENT)),
    authorId: JSON.parse(JSON.stringify(CityzenSample.LUCA.id.toJson())),
    cityId: CitySample.MARTIGNAS.insee,
    address: JSON.parse(JSON.stringify(AddressSample.ACCIDENT_ADDRESS)),
    views: HOTSPOT_INITIAL_VIEWS,
    scope: HotspotScope.Public,
    type: HotspotType.Alert,
    iconType: HotspotIconType.Accident,
    removed: false,
};

export const EVENT_MATCH = {
    id: EventHotspotSample.MATCH_EVENT.id,
    title: EventHotspotSample.MATCH_EVENT.title,
    position: JSON.parse(JSON.stringify(PositionSample.MATCH)),
    authorId: JSON.parse(JSON.stringify(CityzenSample.LUCA.id.toJson())),
    slug: slug(EventHotspotSample.MATCH_EVENT.title),
    cityId: CitySample.MARTIGNAS.insee,
    address: JSON.parse(JSON.stringify(AddressSample.MATCH_ADDRESS)),
    views: HOTSPOT_INITIAL_VIEWS,
    scope: HotspotScope.Public,
    type: HotspotType.Event,
    iconType: HotspotIconType.Event,
    description: EventHotspotSample.MATCH_EVENT.description,
    dateEnd: EventHotspotSample.MATCH_EVENT.dateEnd,
    removed: false,
};

export const MARTIGNAS_CITY = JSON.parse(JSON.stringify(CitySample.MARTIGNAS));

export const CITYZEN_ELODIE = JSON.parse(JSON.stringify(CityzenSample.ELODIE));
export const CITYZEN_LOUISE = JSON.parse(JSON.stringify(CityzenSample.LOUISE));
export const CITYZEN_MARTIN = JSON.parse(JSON.stringify(CityzenSample.MARTIN));
export const CITYZEN_LIONNEL = JSON.parse(JSON.stringify(CityzenSample.LIONNEL));
export const CITYZEN_LIONNEL2 = JSON.parse(JSON.stringify(CityzenSample.LIONNEL2));
export const CITYZEN_LUCA = JSON.parse(JSON.stringify(CityzenSample.LUCA));
export const CITYZEN_LUCA_GOOGLE = JSON.parse(JSON.stringify(CityzenSample.LUCA_GOOGLE));

const databaseInitialize = () => {
    hotspotCollection = db.getCollection('hotspots');
    if (hotspotCollection === null) {
        hotspotCollection = db.addCollection('hotspots');

        hotspotCollection.insert(HOTSPOT_MARTIGNAS_TOWNHALL);
        hotspotCollection.insert(HOTSPOT_MARTIGNAS_CHURCH);
        hotspotCollection.insert(HOTSPOT_MARTIGNAS_SCHOOL);
        hotspotCollection.insert(HOTSPOT_MERIGNAC_CENTER);
        hotspotCollection.insert(HOTSPOT_SIMCITY_TOEDIT);
        hotspotCollection.insert(ALERT_ACCIDENT);
        hotspotCollection.insert(EVENT_MATCH);
    }
    messageCollection = db.getCollection('messages');
    if (messageCollection === null) {
        messageCollection = db.addCollection('messages');

        const message1 = JSON.parse(JSON.stringify(MessageSample.MARTIGNAS_CHURCH_MESSAGE));
        message1.removed = false;
        messageCollection.insert(message1);
        const message2 = JSON.parse(JSON.stringify(MessageSample.MARTIGNAS_SCHOOL_MESSAGE));
        message2.removed = false;
        messageCollection.insert(message2);
        const message3 = JSON.parse(JSON.stringify(MessageSample.MARTIGNAS_TOWNHALL_MESSAGE));
        message3.removed = false;
        messageCollection.insert(message3);
        const message4 = JSON.parse(JSON.stringify(MessageSample.SIMCITY_TOEDIT_MESSAGE));
        message4.removed = false;
        messageCollection.insert(message4);
    }
    cityCollection = db.getCollection('city');
    if (cityCollection === null) {
        cityCollection = db.addCollection('city');

        cityCollection.insert(MARTIGNAS_CITY);
    }

    cityzenCollection = db.getCollection('cityzens');
    if (cityzenCollection === null) {
        cityzenCollection = db.addCollection('cityzens');

        cityzenCollection.insert(CITYZEN_ELODIE);
        cityzenCollection.insert(CITYZEN_LOUISE);
        cityzenCollection.insert(CITYZEN_MARTIN);
        cityzenCollection.insert(CITYZEN_LIONNEL);
        cityzenCollection.insert(CITYZEN_LIONNEL2);
        cityzenCollection.insert(CITYZEN_LUCA);
        cityzenCollection.insert(CITYZEN_LUCA_GOOGLE);
    }
};

const db = new loki('loki/loki.json', {
    autoload: true,
    autoloadCallback: databaseInitialize,
    autosave: true,
    autosaveInterval: 4000,
});

export { cityzenCollection, hotspotCollection, messageCollection, cityCollection };
