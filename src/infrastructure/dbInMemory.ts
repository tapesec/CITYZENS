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

const hotspot = db.addCollection('hotspots');

hotspot.insert({
    id: v4(),
    title: HotspotSample.TOWNHALL.title,
    position: JSON.parse(JSON.stringify(PositionSample.TOWNHALL)),
    content: JSON.parse(JSON.stringify(ContentSample.MARTIGNAS_TOWNHALL_MESSAGE)),
    authorId: CityzenSample.ELODIE.email,
    idCity: CitySample.MARTIGNAS.insee,
    address: JSON.parse(JSON.stringify(AddressSample.TOWNHALL_ADDRESS)),
    scope: HotspotScope.Public,
});

hotspot.insert({
    id: v4(),
    title: HotspotSample.CHURCH.title,
    position: JSON.parse(JSON.stringify(PositionSample.CHURCH)),
    content: JSON.parse(JSON.stringify(ContentSample.CHURCH_MESSAGE)),
    authorId: CityzenSample.LOUISE.email,
    idCity: CitySample.MARTIGNAS.insee,
    address: JSON.parse(JSON.stringify(AddressSample.CHURCH_ADDRESS)),
    scope: HotspotScope.Public,
});

hotspot.insert({
    id: v4(),
    title: HotspotSample.SCHOOL.title,
    position: JSON.parse(JSON.stringify(PositionSample.SCHOOL)),
    content: JSON.parse(JSON.stringify(ContentSample.MARTIGNAS_SCHOOL_MESSAGE)),
    authorId: CityzenSample.ELODIE.email,
    idCity: CitySample.MARTIGNAS.insee,
    address: JSON.parse(JSON.stringify(AddressSample.SCHOOL_ADDRESS)),
    scope: HotspotScope.Public,
});

hotspot.insert({
    id: v4(),
    title: HotspotSample.MERIGNAC.title,
    position: JSON.parse(JSON.stringify(PositionSample.MERIGNAC)),
    content: JSON.parse(JSON.stringify(ContentSample.MARTIGNAS_TOWNHALL_MESSAGE)),
    authorId: CityzenSample.MARTIN.email,
    idCity: CitySample.MERIGNAC.insee,
    address: JSON.parse(JSON.stringify(AddressSample.RANDOM_MERIGNAC_ADDRESS)),
    scope: HotspotScope.Public,
});


const cityzen = db.addCollection('cityzens');

cityzen.insert(JSON.parse(JSON.stringify(CityzenSample.ELODIE)));
cityzen.insert(JSON.parse(JSON.stringify(CityzenSample.LOUISE)));
cityzen.insert(JSON.parse(JSON.stringify(CityzenSample.MARTIN)));


const city = db.addCollection('city');

module.exports.hotspotCollection = hotspot;
module.exports.cityzenCollection = cityzen;
module.exports.cityCollection = city;
