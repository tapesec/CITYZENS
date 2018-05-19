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
import config from './../api/config';
import EventHotspot from '../domain/cityLife/model/hotspot/EventHotspot';

let hotspotCollection: any;
let messageCollection: any;
let cityCollection: any;
let cityzenCollection: any;

export const HOTSPOT_MARTIGNAS_TOWNHALL = {
    ...WallHotspotSample.TOWNHALL.toJSON(),
    authorId: WallHotspotSample.TOWNHALL.author.id.toString(),
    removed: false,
};
export const HOTSPOT_MARTIGNAS_CHURCH = {
    ...WallHotspotSample.CHURCH.toJSON(),
    authorId: WallHotspotSample.CHURCH.author.id.toString(),
    removed: false,
};
export const HOTSPOT_MARTIGNAS_SCHOOL = {
    ...WallHotspotSample.SCHOOL.toJSON(),
    authorId: WallHotspotSample.SCHOOL.author.id.toString(),
    removed: false,
};
export const HOTSPOT_MERIGNAC_CENTER = {
    ...WallHotspotSample.MERIGNAC.toJSON(),
    authorId: WallHotspotSample.MERIGNAC.author.id.toString(),
    removed: false,
};

export const HOTSPOT_SIMCITY_TOEDIT = {
    ...WallHotspotSample.TOEDIT.toJSON(),
    authorId: WallHotspotSample.TOEDIT.author.id.toString(),
    removed: false,
};

export const HOTSPOT_DOCTOR = {
    ...WallHotspotSample.DOCTOR.toJSON(),
    authorId: WallHotspotSample.DOCTOR.author.id.toString(),
    removed: false,
};

export const ALERT_ACCIDENT = {
    ...AlertHotspotSample.ACCIDENT.toJSON(),
    authorId: AlertHotspotSample.ACCIDENT.author.id.toString(),
    removed: false,
};

export const CAMELOT = {
    ...AlertHotspotSample.TOEDIT_CAMELOT.toJSON(),
    authorId: AlertHotspotSample.TOEDIT_CAMELOT.author.id.toString(),
    removed: false,
};

export const EVENT_MATCH = {
    ...EventHotspotSample.MATCH_EVENT.toJSON(),
    authorId: EventHotspotSample.MATCH_EVENT.author.id.toString(),
    removed: false,
};

export const MARTIGNAS_CITY = JSON.parse(JSON.stringify(CitySample.MARTIGNAS));

export const CITYZEN_ELODIE = JSON.parse(JSON.stringify(CityzenSample.ELODIE));
export const CITYZEN_LOUISE = JSON.parse(JSON.stringify(CityzenSample.LOUISE));
export const CITYZEN_MARTIN = JSON.parse(JSON.stringify(CityzenSample.MARTIN));
export const CITYZEN_LIONNEL = JSON.parse(JSON.stringify(CityzenSample.LIONNEL));
export const CITYZEN_LUCA = JSON.parse(JSON.stringify(CityzenSample.LUCA));

const env: string = config.server.env;
const isInTest = env === 'test';
const lokiDevPath = 'loki/dev.json';
const lokiTestPath = 'loki/test.json';
const lokiPath = isInTest ? lokiTestPath : lokiDevPath;

const databaseInitialize = () => {
    hotspotCollection = db.getCollection('hotspots');
    if (hotspotCollection === null) {
        hotspotCollection = db.addCollection('hotspots');

        hotspotCollection.insert(HOTSPOT_MARTIGNAS_TOWNHALL);
        hotspotCollection.insert(HOTSPOT_MARTIGNAS_CHURCH);
        hotspotCollection.insert(HOTSPOT_MARTIGNAS_SCHOOL);
        hotspotCollection.insert(HOTSPOT_MERIGNAC_CENTER);
        hotspotCollection.insert(HOTSPOT_SIMCITY_TOEDIT);
        hotspotCollection.insert(HOTSPOT_DOCTOR);
        hotspotCollection.insert(ALERT_ACCIDENT);
        hotspotCollection.insert(CAMELOT);
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
        cityzenCollection.insert(CITYZEN_LUCA);
    }
};

const db = new loki(lokiPath, {
    autoload: true,
    autoloadCallback: databaseInitialize,
    autosave: !isInTest,
    autosaveInterval: 4000,
});

export { cityzenCollection, hotspotCollection, messageCollection, cityCollection };
