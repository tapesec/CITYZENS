const hotspotCollection = require('./dbInMemory').hotspotCollection;
const cityzenCollection = require('./dbInMemory').cityzenCollection;

const hotspotFind = (requestParams : any) => {
    let hotspotsResults : any;
    if (typeof requestParams === 'function')
        hotspotsResults = hotspotCollection.where(requestParams);
    else
        hotspotsResults = hotspotCollection.find(requestParams);
    const authorIds = hotspotsResults.map((hotspot : any) => hotspot.authorId);
    const cityzensList = cityzenCollection.find({ email: { $in : authorIds } });
    const cityzenObject : any = {};
    cityzensList.forEach((cityzen : any) => {
        cityzenObject[cityzen.email] = cityzen;
    });
    const structuredData = hotspotsResults.map((hotspot : any) => {
        hotspot.cityzen = cityzenObject[hotspot.authorId];
        return hotspot;
    });
    return structuredData;
};

const hotspotFindOne = (requestParams : any) => {
    const hotspotsResult : any = hotspotCollection.findOne(requestParams);
    hotspotsResult.cityzen = cityzenCollection.findOne({ email: hotspotsResult.authorId });
    return hotspotsResult;
};

const hotspotSave = (data : any) => {
    hotspotCollection.insert(data);
};

export default {
    hotspot: {
        findAll: hotspotFind,
        findOne: hotspotFindOne,
        save: hotspotSave,
    },
};
