var loki = require('loki');
const db = new loki('loki.json');

const hotspot = db.addCollection('hotspots');
const cityzen = db.addCollection('cityzens');
const city = db.addCollection('city');

module.exports.hotspotCollection = hotspot;
module.exports.cityzenCollection = cityzen;
module.exports.cityCollection = city;
