import { HOTSPOT_ENDPOINT } from '../api/routers/constants';
import HotspotSample from '../domain/cityLife/model/sample/HotspotSample';
import CitySample from '../domain/cityLife/model/sample/CitySample';
import ContentSample from '../domain/cityLife/model/sample/ContentSample';
import AddressSample from '../domain/cityLife/model/sample/AddressSample';
import { HotspotScope } from '../domain/cityLife/model/hotspot/Hotspot';
const loki = require('lokijs');
const db = new loki('loki.json');
import CityzenSample from '../domain/cityzens/model/CityzenSample';
import PositionSample from './../domain/cityLife/model/sample/PositionSample';
import { v4 } from 'uuid';

const hotspotCollection = db.addCollection('hotspots');

export const HOTSPOT_MARTIGNAS_TOWNHALL = {
    id: HotspotSample.TOWNHALL.id,
    title: HotspotSample.TOWNHALL.title,
    position: JSON.parse(JSON.stringify(PositionSample.TOWNHALL)),
    content: JSON.parse(JSON.stringify(ContentSample.MARTIGNAS_TOWNHALL_MESSAGE)),
    authorId: CityzenSample.ELODIE.email,
    idCity: CitySample.MARTIGNAS.insee,
    address: JSON.parse(JSON.stringify(AddressSample.TOWNHALL_ADDRESS)),
    scope: HotspotScope.Public,
};
export const HOTSPOT_MARTIGNAS_CHURCH = {
    id: HotspotSample.CHURCH.id,
    title: HotspotSample.CHURCH.title,
    position: JSON.parse(JSON.stringify(PositionSample.CHURCH)),
    content: JSON.parse(JSON.stringify(ContentSample.CHURCH_MESSAGE)),
    authorId: CityzenSample.LOUISE.email,
    idCity: CitySample.MARTIGNAS.insee,
    address: JSON.parse(JSON.stringify(AddressSample.CHURCH_ADDRESS)),
    scope: HotspotScope.Public,
};
export const HOTSPOT_MARTIGNAS_SCHOOL = {
    id: HotspotSample.SCHOOL.id,
    title: HotspotSample.SCHOOL.title,
    position: JSON.parse(JSON.stringify(PositionSample.SCHOOL)),
    content: JSON.parse(JSON.stringify(ContentSample.MARTIGNAS_SCHOOL_MESSAGE)),
    authorId: CityzenSample.ELODIE.email,
    idCity: CitySample.MARTIGNAS.insee,
    address: JSON.parse(JSON.stringify(AddressSample.SCHOOL_ADDRESS)),
    scope: HotspotScope.Public,
};
export const HOTSPOT_MERIGNAC_CENTER = {
    id: HotspotSample.MERIGNAC.id,
    title: HotspotSample.MERIGNAC.title,
    position: JSON.parse(JSON.stringify(PositionSample.MERIGNAC)),
    content: JSON.parse(JSON.stringify(ContentSample.MARTIGNAS_TOWNHALL_MESSAGE)),
    authorId: CityzenSample.MARTIN.email,
    idCity: CitySample.MERIGNAC.insee,
    address: JSON.parse(JSON.stringify(AddressSample.RANDOM_MERIGNAC_ADDRESS)),
    scope: HotspotScope.Public,
};

hotspotCollection.insert(HOTSPOT_MARTIGNAS_TOWNHALL);
hotspotCollection.insert(HOTSPOT_MARTIGNAS_CHURCH);
hotspotCollection.insert(HOTSPOT_MARTIGNAS_SCHOOL);
hotspotCollection.insert(HOTSPOT_MERIGNAC_CENTER);

const cityzenCollection = db.addCollection('cityzens');
export const CITYZEN_ELODIE = JSON.parse(JSON.stringify(CityzenSample.ELODIE));
export const CITYZEN_LOUISE = JSON.parse(JSON.stringify(CityzenSample.LOUISE));
export const CITYZEN_MARTIN = JSON.parse(JSON.stringify(CityzenSample.MARTIN));

cityzenCollection.insert(CITYZEN_ELODIE);
cityzenCollection.insert(CITYZEN_LOUISE);
cityzenCollection.insert(CITYZEN_MARTIN);const city = db.addCollection('city');

export { cityzenCollection };
export { hotspotCollection };
