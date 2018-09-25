import Carte from '../domain/hotspot/Carte';
import IMessageRepository from '../domain/hotspot/IMessageRepository';
import UseCaseStatus from './UseCaseStatus';
import Cityzen from '../domain/cityzen/Cityzen';
import HotspotId from '../domain/hotspot/HotspotId';
import * as isAuthorized from '../domain/hotspot/services/isAuthorized';
import MessageFactory from '../domain/hotspot/MessageFactory';
import Message from '../domain/hotspot/Message';

interface PublierUnMessageResultat {
    status: UseCaseStatus;
    newMessage?: Message;
}
interface PublierUnMessageParametres {
    user: Cityzen;
    hotspotId: HotspotId;
    payload: any;
}

class PublierUnMessage {
    constructor(protected carte: Carte, protected messageRepo: IMessageRepository) {}
    async run(params: PublierUnMessageParametres): Promise<PublierUnMessageResultat> {
        const hotspot = await this.carte.findById(params.hotspotId);
        if (!hotspot) {
            return {
                status: UseCaseStatus.NOT_FOUND,
            };
        }
        if (!isAuthorized.toPostMessages(hotspot, params.user)) {
            return {
                status: UseCaseStatus.UNAUTHORIZED,
            };
        }
        const data = {
            ...params.payload,
            hotspotId: params.hotspotId.toString(),
            cityzen: params.user,
        };
        const newMessage = new MessageFactory().createMessage(data);
        await this.messageRepo.store(newMessage);
        return {
            newMessage,
            status: UseCaseStatus.OK,
        };
    }
}
export default PublierUnMessage;
