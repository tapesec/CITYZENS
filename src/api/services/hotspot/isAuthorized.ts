import Cityzen from './../../../domain/cityzens/model/Cityzen';
import Hotspot, { HotspotScope } from './../../../domain/cityLife/model/hotspot/Hotspot';
import MediaHotspot from './../../../domain/cityLife/model/hotspot/MediaHotspot';
import Message from '../../../domain/cityLife/model/messages/Message';

const toSeeHotspot = (hotspot: Hotspot, member?: Cityzen) => {
    if (!(hotspot instanceof MediaHotspot)) return true;
    if (hotspot.scope === HotspotScope.Public) return true;
    if (!member) return false;
    if (member.isAdmin) return true;

    const authorized = hotspot.members;
    return hotspot.author.id === member.id || authorized.has(member.id);
};

const toSeeMessages = (Hotspot: Hotspot, member?: Cityzen) => {
    return toSeeHotspot(Hotspot, member);
};

const toAddMember = (hotspot: Hotspot, cityzen?: Cityzen) => {
    if (!cityzen) return false;
    if (cityzen.isAdmin) return true;

    return hotspot.author.id === cityzen.id;
};

const toPostMessages = (hotspot: Hotspot, cityzen?: Cityzen) => {
    if (!cityzen) return false;
    if (cityzen.isAdmin) return true;

    return hotspot.author.id === cityzen.id;
};

const toPatchHotspot = (hotspot: Hotspot, cityzen?: Cityzen) => {
    if (!cityzen) return false;
    if (cityzen.isAdmin) return true;

    return hotspot.author.id === cityzen.id;
};

const toPatchMessages = (hotspot: Hotspot, cityzen?: Cityzen) => {
    return toPatchHotspot(hotspot, cityzen);
};

const toPatchMessage = (hotspot: Hotspot, message: Message, cityzen?: Cityzen) => {
    return toPatchHotspot(hotspot, cityzen) && message.author.id === cityzen.id;
};

const toRemoveHotspot = (hotspot: Hotspot, cityzen?: Cityzen) => {
    if (!cityzen) return false;
    if (cityzen.isAdmin) return true;

    return hotspot.author.id === cityzen.id;
};

const toRemoveMessages = (hotspot: Hotspot, cityzen?: Cityzen) => {
    return toRemoveHotspot(hotspot, cityzen);
};

export {
    toSeeHotspot,
    toAddMember,
    toPatchHotspot,
    toRemoveHotspot,
    toSeeMessages,
    toPatchMessage,
    toPatchMessages,
    toRemoveMessages,
    toPostMessages,
};
