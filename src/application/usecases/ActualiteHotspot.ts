import Carte from '../domain/hotspot/Carte';
import UseCaseStatus from './UseCaseStatus';
import HotspotId from './../domain/hotspot/HotspotId';
import IMessageRepository from '../domain/hotspot/IMessageRepository';
import Cityzen from '../domain/cityzen/Cityzen';
import Message from '../domain/hotspot/Message';
import * as isAuthorized from './../domain/hotspot/services/isAuthorized';
import MessageId from '../domain/hotspot/MessageId';

export interface listeMessagesParametre {
    hotspotId: HotspotId;
    user: Cityzen;
    messagesId?: MessageId[];
}
export interface listeMessagesResultat {
    status: UseCaseStatus;
    messages?: Message[];
}
export interface compteNombreCommentairesParMessageResultat {
    status: UseCaseStatus;
    countCommentsPerMessages?: {
        [s: string]: number;
    };
}

class ActualiteHotspot {
    constructor(protected carte: Carte, protected messageRepo: IMessageRepository) {}
    public async listeMessages(params: listeMessagesParametre): Promise<listeMessagesResultat> {
        const status = await this.testKOconditions(params.hotspotId, params.user);
        if (status) {
            return {
                status,
            };
        }
        const actualite: Message[] = await this.messageRepo.findByHotspotId(params.hotspotId);
        return {
            status: UseCaseStatus.OK,
            messages: actualite,
        };
    }
    public async compteNombreCommentairesParMessage(
        params: listeMessagesParametre,
    ): Promise<compteNombreCommentairesParMessageResultat> {
        const status = await this.testKOconditions(params.hotspotId, params.user);
        if (status) {
            return {
                status,
            };
        }
        const countCommentsPerMessages = await this.messageRepo.getCommentsCount(params.messagesId);
        return {
            countCommentsPerMessages,
            status: UseCaseStatus.OK,
        };
    }

    private async testKOconditions(
        hotspotId: HotspotId,
        user: Cityzen,
    ): Promise<UseCaseStatus | undefined> {
        const hotspot = await this.carte.findById(hotspotId);
        if (!hotspot) {
            return UseCaseStatus.NOT_FOUND;
        }
        if (!isAuthorized.toSeeMessages(hotspot, user)) {
            return UseCaseStatus.UNAUTHORIZED;
        }
        return undefined;
    }
}

export default ActualiteHotspot;
