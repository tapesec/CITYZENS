import Message from '../../../domain/model/Message';
import Hotspot, { HotspotScope } from '../../../domain/model/Hotspot';
import MediaHotspot from '../../../domain/model/MediaHotspot';
import Cityzen from './../../../domain/cityzens/model/Cityzen';

const toSeeHotspot = (hotspot: Hotspot, member?: Cityzen) => {
    if (!(hotspot instanceof MediaHotspot)) return true;
    if (hotspot.scope === HotspotScope.Public) return true;
    if (!member) return false;
    if (member.isAdmin) return true;

    const authorized = hotspot.members;
    return hotspot.author.id.isEqual(member.id) || authorized.has(member.id);
};

const toSeeMessages = (Hotspot: Hotspot, member?: Cityzen) => {
    return toSeeHotspot(Hotspot, member);
};

const toAddMember = (hotspot: Hotspot, cityzen?: Cityzen) => {
    if (!cityzen) return false;
    if (cityzen.isAdmin) return true;

    return hotspot.author.id.isEqual(cityzen.id);
};

const toPostMessages = (hotspot: Hotspot, cityzen?: Cityzen) => {
    if (!cityzen) return false;
    if (cityzen.isAdmin) return true;

    return hotspot.author.id.isEqual(cityzen.id);
};

const toPatchHotspot = (hotspot: Hotspot, cityzen?: Cityzen) => {
    if (!cityzen) return false;
    if (cityzen.isAdmin) return true;

    return hotspot.author.id.isEqual(cityzen.id);
};

const toPatchMessages = (message: Message, cityzen?: Cityzen) => {
    if (cityzen === undefined) return false;
    if (cityzen.isAdmin) return true;

    return message.author.id.isEqual(cityzen.id);
};

const toPatchMessage = (message: Message, cityzen?: Cityzen) => {
    if (!cityzen) return false;
    if (cityzen.isAdmin) return true;

    return message.author.id.isEqual(cityzen.id);
};

const toRemoveHotspot = (hotspot: Hotspot, cityzen?: Cityzen) => {
    if (!cityzen) return false;
    if (cityzen.isAdmin) return true;

    return hotspot.author.id.isEqual(cityzen.id);
};

const toRemoveMessages = (message: Message, cityzen?: Cityzen) => {
    if (cityzen === undefined) return false;
    if (cityzen.isAdmin) return true;

    return message.author.id.isEqual(cityzen.id);
};

const toPostComments = (hotspot: Hotspot, cityzen: Cityzen) => {
    return toSeeHotspot(hotspot, cityzen);
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
    toPostComments,
};
