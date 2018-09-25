import HotspotId from '../domain/hotspot/HotspotId';
import MessageId from '../domain/hotspot/MessageId';
import Message from '../domain/hotspot/Message';
import UseCaseStatus from './UseCaseStatus';
import Carte from '../domain/hotspot/Carte';
import IMessageRepository from '../domain/hotspot/IMessageRepository';
import * as isAuthorized from '../domain/hotspot/services/isAuthorized';
import Cityzen from '../domain/cityzen/Cityzen';

export interface ObtenirCommentairesParametres {
    hotspotId: HotspotId;
    messageId: MessageId;
    user: Cityzen;
}
export interface ObtenirCommentairesResultat {
    comments?: Message[];
    status: UseCaseStatus;
}

class ObtenirCommentaires {
    constructor(protected carte: Carte, protected messageRepo: IMessageRepository) {}
    async run(params: ObtenirCommentairesParametres): Promise<ObtenirCommentairesResultat> {
        const hotspot = await this.carte.findById(params.hotspotId);
        if (!hotspot) {
            return {
                status: UseCaseStatus.NOT_FOUND,
            };
        }
        if (!isAuthorized.toSeeMessages(hotspot, params.user)) {
            return {
                status: UseCaseStatus.UNAUTHORIZED,
            };
        }
        const comments = await this.messageRepo.findComments(params.messageId);
        return {
            comments,
            status: UseCaseStatus.OK,
        };
    }
}

export default ObtenirCommentaires;
