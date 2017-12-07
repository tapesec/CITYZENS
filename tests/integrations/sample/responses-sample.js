import MessageFactory from '../../../src/infrastructure/MessageFactory';
import CityzenSample from '../../../src/domain/cityzens/model/CityzenSample';
import { createMessageBody } from './requests-bodies';

export const newMessageResponse = () => {
    const body = createMessageBody;
    body.cityzen = CityzenSample.ELODIE;
    const message = new MessageFactory().createMessage(body);
    return JSON.stringify(message);
}
