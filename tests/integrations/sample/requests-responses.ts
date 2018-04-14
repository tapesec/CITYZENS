import HotspotFactory from '../../../src/infrastructure/HotspotFactory';
import AddressSample from '../../../src/domain/cityLife/model/sample/AddressSample';
import PositionSample from '../../../src/domain/cityLife/model/sample/PositionSample';
import CitySample from '../../../src/domain/cityLife/model/sample/CitySample';
import MessageSample from '../../../src/domain/cityLife/model/sample/MessageSample';
import { username, password } from './granted-cityzen';
import HotspotId from '../../../src/domain/cityLife/model/hotspot/HotspotId';
import MessageFactory from '../../../src/infrastructure/MessageFactory';
import {
    FAKE_USER_INFO_AUTH0,
    FAKE_ADMIN_USER_INFO_AUTH0,
} from './../../unitaires/api/services/samples';
import cityzenFromAuth0 from './../../../src/api/services/cityzen/cityzenFromAuth0';
import Hotspot, {
    HotspotIconType,
    HotspotScope,
    HotspotType,
} from '../../../src/domain/cityLife/model/hotspot/Hotspot';

export const loginBody = {
    password,
    username: `${username}@gmail.com`,
};

// POST /hotspots
export const createHotspotBody = {
    title: 'a testing new hotspot',
    cityId: CitySample.SIMCITY.insee,
    position: JSON.parse(JSON.stringify(PositionSample.TOEDIT)),
    address: JSON.parse(JSON.stringify(AddressSample.TOEDIT_ADDRESS)),
    scope: HotspotScope.Private,
    type: HotspotType.WallMessage,
    iconType: HotspotIconType.Wall,
    avatarIconUrl: 'a testing url :) zeaazoekjhazdoiajdiojazdi',
};

export const newHotspotResponse = () => {
    const body = {
        ...createHotspotBody,
        cityzen: cityzenFromAuth0(FAKE_USER_INFO_AUTH0),
    };

    const newHotspot = new HotspotFactory().build(body);
    return JSON.parse(JSON.stringify(newHotspot));
};

// POST /hotspots/{hotspotId}/messages
export const createMessageBody = {
    title: 'a message title',
    body: 'lorem ipsum dolor',
    pinned: false,
};
// response
export const newMessageResponse = (hotspotId: string) => {
    const body: any = {
        ...createMessageBody,
        cityzen: cityzenFromAuth0(FAKE_USER_INFO_AUTH0),
        hotspotId: new HotspotId(hotspotId),
    };
    const message = new MessageFactory().createMessage(body);
    return JSON.parse(JSON.stringify(message));
};

// PATCH /hotspots/{hotspotId/messages/{messageId}
export const patchMessageBody = {
    title: 'an updated message',
    body: 'Oups ! i made a mistake',
    pinned: true,
};

// response
export const editedMessageResponse = () => {
    const message = MessageSample.SIMCITY_TOEDIT_MESSAGE;
    message.changeTitle(patchMessageBody.title);
    message.editBody(patchMessageBody.body);
    message.togglePinMode();
    return JSON.parse(JSON.stringify(message));
};

// PATCH url=/hotspots/{hotspotId}

export const patchHotspotBodyTitle = {
    title: 'new title',
};

export const patchHotspotBodyScope = {
    scope: HotspotScope.Private,
};

export const postSlideShow = {
    type: 0,
    images: [['url', 'desc']],
};
