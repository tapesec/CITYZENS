import Cityzen from '../domain/cityzen/Cityzen';
import HotspotId from '../domain/hotspot/HotspotId';
import MessageId from '../domain/hotspot/MessageId';
import Carte from '../domain/hotspot/Carte';
import IMessageRepository from '../domain/hotspot/IMessageRepository';
import UseCaseStatus from './UseCaseStatus';
import Message from '../domain/hotspot/Message';
import * as isAuthorized from '../domain/hotspot/services/isAuthorized';
import editeMessage from '../domain/hotspot/editeMessage';

export interface EditerUnMessageParametres {
    user: Cityzen;
    hotspotId: HotspotId;
    messageId: MessageId;
    payload: any;
}

export interface EditerUnMessageResultat {
    status: UseCaseStatus;
    editedMessage?: Message;
}

class EditerUnMessage {
    constructor(protected carte: Carte, protected messageRepo: IMessageRepository) {}
    public async run(params: EditerUnMessageParametres): Promise<EditerUnMessageResultat> {
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
        if (!isAuthorized.toPatchMessage(message, params.user)) {
            return {
                status: UseCaseStatus.NOT_OWNER_NOR_GRANTED,
            };
        }
        const editedMessage = editeMessage(message, params.payload);
        await this.messageRepo.update(editedMessage);
        return {
            editedMessage,
            status: UseCaseStatus.OK,
        };
    }
}

export default EditerUnMessage;
