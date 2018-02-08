import Cityzen from './../../../domain/cityzens/model/Cityzen';
import Hotspot, { HotspotScope } from './../../../domain/cityLife/model/hotspot/Hotspot';
import MediaHotspot from './../../../domain/cityLife/model/hotspot/MediaHotspot';

export default (hotspot: Hotspot, member?: Cityzen) => {
    if (!(hotspot instanceof MediaHotspot)) return true;
    if (hotspot.scope === HotspotScope.Public) return true;
    if (!member) return false;

    const authorized = hotspot.members;
    return hotspot.author.id === member.id || authorized.has(member.id);
};
