import AlertHotspot from '../../../domain/model/AlertHotspot';
import Hotspot from '../../../domain/model/Hotspot';
import ImageLocation from '../../../domain/model/ImageLocation';
import MediaHotspot from '../../../domain/model/MediaHotspot';
import SlideShow from '../../../domain/model/SlideShow';
import AvatarIconUrl from '../../../domain/model/AvatarIconUrl';

export default (hotspot: MediaHotspot | AlertHotspot, requestBody: any): Hotspot => {
    if (requestBody.title !== undefined) {
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
    if (requestBody.pictureDescription) {
        (<AlertHotspot>hotspot).addImageDescription(requestBody.pictureDescription);
    }
    return hotspot;
};
