import AlertHotspot from '../../../domain/cityLife/model/hotspot/AlertHotspot';
import Hotspot from '../../../domain/cityLife/model/hotspot/Hotspot';
import ImageLocation from '../../../domain/cityLife/model/hotspot/ImageLocation';
import MediaHotspot from '../../../domain/cityLife/model/hotspot/MediaHotspot';
import SlideShow from '../../../domain/cityLife/model/hotspot/SlideShow';
import AvatarIconUrl from './../../../domain/cityLife/model/hotspot/AvatarIconUrl';

export default (hotspot: MediaHotspot | AlertHotspot, requestBody: any): Hotspot => {
    if (requestBody.title) {
        (<MediaHotspot>hotspot).changeTitle(requestBody.title);
    }
    if (requestBody.scope) {
        (<MediaHotspot>hotspot).changeScope(requestBody.scope);
    }
    if (requestBody.avatarIconUrl) {
        hotspot.changeAvatarIconurl(new AvatarIconUrl(requestBody.avatarIconUrl));
    }

    if (requestBody.slideShow !== undefined) {
        (<MediaHotspot>hotspot).changeSlideShow(
            new SlideShow(requestBody.slideShow.map((x: string) => new ImageLocation(x))),
        );
    }

    if (requestBody.message) {
        (<AlertHotspot>hotspot).editMessage(requestBody.message);
    }
    if (requestBody.alertHotspotImgLocation) {
        (<AlertHotspot>hotspot).addImageDescription(requestBody.alertHotspotImgLocation);
    }
    return hotspot;
};
