import WallHotspot from '../../../domain/cityLife/model/hotspot/WallHotspot';
import EventHotspot from '../../../domain/cityLife/model/hotspot/EventHotspot';
import AlertHotspot from '../../../domain/cityLife/model/hotspot/AlertHotspot';
import Hotspot from '../../../domain/cityLife/model/hotspot/Hotspot';
import MediaHotspot from '../../../domain/cityLife/model/hotspot/MediaHotspot';
import ImageUrl from '../../../domain/cityLife/model/ImageLocation';

export default (hotspot: WallHotspot | EventHotspot | AlertHotspot, requestBody: any): Hotspot => {
    if (requestBody.title) {
        (<WallHotspot | EventHotspot>hotspot).changeTitle(requestBody.title);
    }
    if (requestBody.scope) {
        (<WallHotspot | EventHotspot>hotspot).changeScope(requestBody.scope);
    }
    if (requestBody.avatarIconUrl) {
        (<MediaHotspot>hotspot).changeAvatarIconurl(new ImageUrl(requestBody.avatarIconUrl));
    }

    if (requestBody.dateEnd) {
        (<EventHotspot>hotspot).reportDateEnd(requestBody.dateEnd);
    }
    if (requestBody.description) {
        (<EventHotspot>hotspot).editDescription(requestBody.description);
    }
    if (requestBody.message) {
        (<AlertHotspot>hotspot).editMessage(requestBody.message);
    }
    if (requestBody.alertHotspotImgLocation) {
        (<AlertHotspot>hotspot).addImageDescription(requestBody.alertHotspotImgLocation);
    }
    return hotspot;
};
