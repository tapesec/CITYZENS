const hotspotCollection = require('./dbInMemory').hotspotCollection;
const cityzenCollection = require('./dbInMemory').cityzenCollection;

const hotspotFind = (requestParams : any) => {
    let hotspotsResults : any;
    if (requestParams.byArea) {
        const north = requestParams.byArea[0];
        const south = requestParams.byArea[1];
        const west = requestParams.byArea[2];
        const east = requestParams.byArea[3];
        hotspotsResults = hotspotCollection.where((obj : any) => {
            return (
                obj.position.latitude < north &&
                obj.position.latitude > south &&
                obj.position.longitude > west &&
                obj.position.longitude < east
            );
        });
    } else {
        hotspotsResults = hotspotCollection.find(requestParams);
    }
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
    if (hotspotsResult) {
        hotspotsResult.cityzen = cityzenCollection.findOne({ email: hotspotsResult.authorId });
    }
    return hotspotsResult;
};

const hotspotSave = (data : any) => {
    data.authorId = data.author.email;
    delete data.author.email;
    hotspotCollection.insert(data);
};

const hotspotRemove = (id : string) => {
    hotspotCollection.remove({ id });
};

export default {
    hotspot: {
        findAll: hotspotFind,
        findOne: hotspotFindOne,
        save: hotspotSave,
        remove: hotspotRemove,
    },
};
