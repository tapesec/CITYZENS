import { hotspotCollection, messageCollection } from './dbInMemory';

const hotspotFind = (requestParams: any) => {
    let hotspotsResults: any[];
    if (requestParams.byArea) {
        const north = requestParams.byArea[0];
        const south = requestParams.byArea[2];
        const west = requestParams.byArea[1];
        const east = requestParams.byArea[3];
        hotspotsResults = hotspotCollection.where((obj: any) => {
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
    return hotspotsResults;
};

const hotspotFindOne = (requestParams: any) => {
    const hotspotsResult: any = hotspotCollection.findOne(requestParams);
    return hotspotsResult;
};

const hotspotSave = (data: any) => {
    data.authorId = data.author.id;
    delete data.author;
    hotspotCollection.insert(data);
};

const hotspotUpdate = (data: any) => {
    const hotspot = hotspotCollection.findOne({ id: data.id, removed: false });
    hotspot.views = data.views;
    if (data.title) hotspot.title = data.title;
    if (data.scope) hotspot.scope = data.scope;
    if (data.dateEnd) hotspot.dateEnd = data.dateEnd;
    if (data.description) hotspot.description = data.description;
    if (data.message) hotspot.message = data.message;
    if (data.voterList) hotspot.voterList = data.voterList;
    if (data.avatarIconUrl) hotspot.avatarIconUrl = data.avatarIconUrl;
    if (data.pictureDescription) {
        hotspot.pictureDescription = data.pictureDescription;
    }
    if (data.slideShow) hotspot.slideShow = data.slideShow;
    hotspotCollection.update(hotspot);
};

const hotspotRemove = (id: string) => {
    const hotspot = hotspotCollection.findOne({ id });
    hotspot.removed = true;
    hotspotCollection.update(hotspot);
};

const hotspotCacheAlgolia = (id: string, v: boolean) => {
    const hotspot = hotspotCollection.findOne({ id });
    hotspot.cacheAlgolia = v;
    hotspotCollection.update(hotspot);
};

const messageFind = (requestParams: any) => {
    return messageCollection.find(requestParams);
};

const messageFindOne = (requestParams: any) => {
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

const orm = {
    hotspot: {
        findAll: hotspotFind,
        findOne: hotspotFindOne,
        save: hotspotSave,
        update: hotspotUpdate,
        remove: hotspotRemove,
        cacheAlgolia: hotspotCacheAlgolia,
    },
    message: {
        findAll: messageFind,
        findOne: messageFindOne,
        save: messageSave,
        update: messageUpdate,
        delete: messageDelete,
    },
};
export default orm;

export type Orm = typeof orm;
