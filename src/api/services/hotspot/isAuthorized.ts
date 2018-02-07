import Cityzen from './../../../domain/cityzens/model/Cityzen';
import AlertHotspot from './../../../domain/cityLife/model/hotspot/AlertHotspot';
import WallHotspot from './../../../domain/cityLife/model/hotspot/WallHotspot';
import EventHotspot from './../../../domain/cityLife/model/hotspot/EventHotspot';
import { HotspotScope } from './../../../domain/cityLife/model/hotspot/Hotspot';

export default (hotspot: AlertHotspot | WallHotspot | EventHotspot, member?: Cityzen) => {
    if (hotspot instanceof AlertHotspot) return true;
    if (hotspot.scope === HotspotScope.Public) return true;
    if (!member) return false;

    const authorized = hotspot.members;
    return hotspot.author.id === member.id || authorized.has(member.id);
};
