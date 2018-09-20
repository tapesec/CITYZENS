import AlertHotspot from './AlertHotspot';
import Hotspot from './Hotspot';
import ImageLocation from './ImageLocation';
import MediaHotspot from './MediaHotspot';
import SlideShow from '../SlideShow';
import AvatarIconUrl from '../cityzen/AvatarIconUrl';

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
