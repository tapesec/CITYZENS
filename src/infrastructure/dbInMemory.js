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
    title: 'Mairie',
    position: JSON.parse(JSON.stringify(PositionSample.TOWNHALL)),
    content: JSON.parse(JSON.stringify(ContentSample.MARTIGNAS_TOWNHALL_MESSAGE)),
    authorId: CityzenSample.ELODIE.email,
    idCity: '33273',
    address: JSON.parse(JSON.stringify(AddressSample.TOWNHALL_ADDRESS)),
    scope: HotspotScope.Public
});

hotspot.insert({
    id: v4(),
    title: 'Flora Tristan',
    position: JSON.parse(JSON.stringify(PositionSample.SCHOOL)),
    content: JSON.parse(JSON.stringify(ContentSample.MARTIGNAS_SCHOOL_MESSAGE)),
    authorId: CityzenSample.ELODIE.email,
    idCity: '33273',
    address: JSON.parse(JSON.stringify(AddressSample.SCHOOL_ADDRESS)),
    scope: HotspotScope.Public
});


const cityzen = db.addCollection('cityzens');

cityzen.insert(JSON.parse(JSON.stringify(CityzenSample.ELODIE)));


const city = db.addCollection('city');

module.exports.hotspotCollection = hotspot;
module.exports.cityzenCollection = cityzen;
module.exports.cityCollection = city;
