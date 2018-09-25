import Cityzen from '../domain/cityzen/Cityzen';
import Carte from '../domain/hotspot/Carte';
import HotspotId from '../domain/hotspot/HotspotId';
import IMessageRepository from '../domain/hotspot/IMessageRepository';
import MessageId from '../domain/hotspot/MessageId';
import * as isAuthorized from '../domain/hotspot/services/isAuthorized';
import UseCaseStatus from './UseCaseStatus';
import MessageFactory from '../domain/hotspot/MessageFactory';
import Message from '../domain/hotspot/Message';

export interface RepondreAUnMessageParametres {
    user: Cityzen;
    hotspotId: HotspotId;
    messageId: MessageId;
    payload: any;
}

export interface RepondreAUnMessageResultat {
    status: UseCaseStatus;
    newResponse: Message;
}

class RepondreAUnMessage {
    constructor(protected carte: Carte, protected messageRepo: IMessageRepository) {}
    public async run(params: RepondreAUnMessageParametres) {
        const hotspot = await this.carte.findById(params.hotspotId);
        if (!hotspot) {
            return {
                status: UseCaseStatus.NOT_FOUND,
            };
        }
        const message = await this.messageRepo.findById(params.messageId);
        if (!message) {
            return {
                status: UseCaseStatus.MESSAGE_NOT_FOUND,
            };
        }
        if (!isAuthorized.toPostComments(hotspot, params.user)) {
            return {
                status: UseCaseStatus.UNAUTHORIZED,
            };
        }
        const data = {
            ...params.payload,
            hotspotId: params.hotspotId.toString(),
            parentId: params.messageId.toString(),
            cityzen: params.user,
        };
        const newResponse = new MessageFactory().createMessage(data);
        await this.messageRepo.store(newResponse);
        return {
            newResponse,
            status: UseCaseStatus.OK,
        };
    }
}
export default RepondreAUnMessage;
