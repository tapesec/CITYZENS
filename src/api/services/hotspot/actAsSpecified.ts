import WallHotspot from '../../../domain/cityLife/model/hotspot/WallHotspot';
import AlertHotspot from '../../../domain/cityLife/model/hotspot/AlertHotspot';
import Hotspot from '../../../domain/cityLife/model/hotspot/Hotspot';
import MediaHotspot from '../../../domain/cityLife/model/hotspot/MediaHotspot';
import AvatarIconUrl from './../../../domain/cityLife/model/hotspot/AvatarIconUrl';
import SlideShow from '../../../domain/cityLife/model/hotspot/SlideShow';
import ImageLocation from '../../../domain/cityLife/model/hotspot/ImageLocation';

export default (hotspot: MediaHotspot | AlertHotspot, requestBody: any): Hotspot => {
    if (requestBody.title) {
        (<MediaHotspot>hotspot).changeTitle(requestBody.title);
    }
    if (requestBody.scope) {
        (<MediaHotspot>hotspot).changeScope(requestBody.scope);
    }
    if (requestBody.avatarIconUrl) {
        (<MediaHotspot>hotspot).changeAvatarIconurl(new AvatarIconUrl(requestBody.avatarIconUrl));
    }

    if (requestBody.slideShow !== undefined) {
        (<MediaHotspot>hotspot).changeSlideShow(
            new SlideShow(requestBody.slideShow.map((x: string) => new ImageLocation(x))),
        );
    }

    if (requestBody.dateEnd) {
        (<MediaHotspot>hotspot).reportDateEnd(new Date(requestBody.dateEnd));
    }
    if (requestBody.message) {
        (<AlertHotspot>hotspot).editMessage(requestBody.message);
    }
    if (requestBody.alertHotspotImgLocation) {
        (<AlertHotspot>hotspot).addImageDescription(requestBody.alertHotspotImgLocation);
    }
    return hotspot;
};
