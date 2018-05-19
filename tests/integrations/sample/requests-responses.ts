import MessageSample from '../../../src/domain/cityLife/model/sample/MessageSample';
import { username } from './granted-cityzen';
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

// according to createhotspotSchema.ts
const CITY_ID = '12345';

/**
 * Base new hotspot payload
 */
const createHotspotBody = {
    cityId: CITY_ID,
    position: {
        // fake-values
        latitude: 10.84032108,
        longitude: -2.77510476,
    },
    address: {
        name: '2 rue du succès',
        city: 'Kaamelott',
    },
};

export const AlertHotspotPostBody = {
    ...createHotspotBody,
    message: 'this is a message alert',
    createdAt: '0650-05-31T22:00:00.000Z',
    type: HotspotType.Alert,
    iconType: HotspotIconType.Accident,
};

export const EventHotspotPostBody = {
    ...createHotspotBody,
    scope: HotspotScope.Public,
    title: 'A simple title for a cool event',
    description: 'Here is a lorem ipsum kind of stuff',
    dateEnd: '0650-05-31T22:00:00.000Z',
    createdAt: '0650-05-31T22:00:00.000Z',
    type: HotspotType.Event,
    iconType: HotspotIconType.Event,
};

export const WallHotspotPostBody = {
    ...createHotspotBody,
    scope: HotspotScope.Public,
    title: 'A simple title for a cool event',
    type: HotspotType.WallMessage,
    iconType: HotspotIconType.Wall,
    avatarIconUrl: 'an-url-fake',
    createdAt: '0650-05-31T22:00:00.000Z',
};
