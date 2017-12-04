import { hotspotCollection, cityzenCollection, messageCollection } from './dbInMemory';

const hotspotFind = (requestParams : any) => {
    let hotspotsResults : any;
    if (requestParams.byArea) {
        const north = requestParams.byArea[0];
        const south = requestParams.byArea[2];
        const west = requestParams.byArea[1];
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
    const cityzensList = cityzenCollection.find({ id: { $in : authorIds } });
    const cityzenObject : any = {};
    cityzensList.forEach((cityzen : any) => {
        cityzenObject[cityzen.id] = cityzen;
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
        hotspotsResult.cityzen = cityzenCollection.findOne({ id: hotspotsResult.authorId });
    }
    return hotspotsResult;
};

const hotspotSave = (data: any) => {
    data.authorId = data.author.id;
    delete data.author;
    hotspotCollection.insert(data);
};

const hotspotRemove = (id: string) => {
    hotspotCollection.remove({ id });
};

const messageFind = (requestParams: any) => {
    return messageCollection.find(requestParams);
};

const messageFindOne = (requestParams: any) => {
    requestParams.removed = false;
    return messageCollection.findOne(requestParams);
};

const messageSave = (data: any) => {
    data.removed = false;
    messageCollection.insert(data);
};

const messageUpdate = (data: any) => {
    const message = messageCollection.findOne({ id: data.id, removed: false });
    message.body = data.body;
    message.title = data.title;
    message.pinned = data.pinned;
    message.updatedAt = data.updatedAt;
    messageCollection.update(message);
};

const messageDelete = (id: string) => {
    const message = messageCollection.findOne({ id });
    message.removed = true;
    messageCollection.update(message);
};

export default {
    hotspot: {
        findAll: hotspotFind,
        findOne: hotspotFindOne,
        save: hotspotSave,
        remove: hotspotRemove,
    },
    message: {
        findAll: messageFind,
        findOne: messageFindOne,
        save: messageSave,
        update: messageUpdate,
        delete: messageDelete,
    },
};
