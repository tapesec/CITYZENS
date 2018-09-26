import Cityzen from '../domain/cityzen/Cityzen';
import Carte from '../domain/hotspot/Carte';
import HotspotId from '../domain/hotspot/HotspotId';
import IMessageRepository from '../domain/hotspot/IMessageRepository';
import MessageId from '../domain/hotspot/MessageId';
import * as isAuthorized from '../domain/hotspot/services/isAuthorized';
import UseCaseStatus from './UseCaseStatus';

export interface SupprimerUnMessageParametre {
    user: Cityzen;
    messageId: MessageId;
    hotspotId: HotspotId;
}
// export interface SupprimerUnMessageResultat {}

class SupprimerUnMessage {
    constructor(protected carte: Carte, protected messageRepo: IMessageRepository) {}
    public async run(params: SupprimerUnMessageParametre): Promise<UseCaseStatus> {
        const hotspot = await this.carte.findById(params.hotspotId);
        if (!hotspot) {
            return UseCaseStatus.NOT_FOUND;
        }
        const message = await this.messageRepo.findById(params.messageId);
        if (!message) {
            return UseCaseStatus.MESSAGE_NOT_FOUND;
        }
        if (!isAuthorized.toRemoveMessages(message, params.user)) {
            return UseCaseStatus.UNAUTHORIZED;
        }
        await this.messageRepo.delete(params.messageId);
        return UseCaseStatus.OK;
    }
}
export default SupprimerUnMessage;
