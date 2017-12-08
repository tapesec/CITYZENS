import MessageSample from '../../../src/domain/cityLife/model/sample/MessageSample';
import { username, password } from './granted-cityzen';
import HotspotId from '../../../src/domain/cityLife/model/hotspot/HotspotId';
import MessageFactory from '../../../src/infrastructure/MessageFactory';

export const loginBody = {
  username: `${username}@gmail.com`,
  password: password
};

// POST /hotspots/{hotspotId}/messages
export const createMessageBody = {
  title: 'a message title',
  body: 'lorem ipsum dolor',
  pinned: false,
};
// response
export const newMessageResponse = (hotspotId) => {
    const body = createMessageBody;
    body.hotspotId = new HotspotId(hotspotId);
    const message = new MessageFactory().createMessage(body);
    return JSON.parse(JSON.stringify(message));
}

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
}

// POST /hotspots
export const createHotspotBody = {
    title: "a test title",
    id_city: "random-INSEE",
    message: "Speak you mind !",
    position: {
      latitude: 41.27035463307484,
      longitude: 11.587675362825394,
    },
    address: {
      city: "Martignas",
      name: "fake street"
    },
    scope: "public"
};
