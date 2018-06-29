import { HotspotScope, HotspotType } from '../../../src/domain/cityLife/model/hotspot/Hotspot';
import HotspotId from '../../../src/domain/cityLife/model/hotspot/HotspotId';
import MessageSample from '../../../src/domain/cityLife/model/sample/MessageSample';
import MessageFactory from '../../../src/infrastructure/MessageFactory';
import cityzenFromAuth0 from './../../../src/api/services/cityzen/cityzenFromAuth0';
import { FAKE_USER_INFO_AUTH0 } from './../../unitaires/api/services/samples';

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

export const commentPostBody = {
    title: 'I Would like to make a comment',
    body: 'No Comment.',
    parentId: MessageSample.MARTIGNAS_CHURCH_MESSAGE.id.toString(),
    pinned: false,
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
    avatarIconUrl: 'an-url-fake',
};

export const AlertHotspotPostBody = {
    ...createHotspotBody,
    message: 'this is a message alert',
    type: HotspotType.Alert,
    pictureDescription: 'Best location in the world',
};

export const MediaHotspotPostBody = {
    ...createHotspotBody,
    scope: HotspotScope.Public,
    title: 'A simple title for a cool event',
    type: HotspotType.Media,
};
