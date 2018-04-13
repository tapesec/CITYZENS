import AlertMessage from './AlertMessage';
import HotspotBuilder from '../../factories/HotspotBuilder';
import Hotspot from './Hotspot';
import PertinenceScore from './PertinenceScore';
import VoterList from './VoterList';
import CityzenId from '../../../cityzens/model/CityzenId';

class AlertHotspot extends Hotspot {
    constructor(
        hotpotBuilder: HotspotBuilder,
        protected _message: AlertMessage,
        protected _pertinence: PertinenceScore,
        protected _voterList: VoterList,
    ) {
        super(hotpotBuilder);
    }

    public addVoter(voterId: CityzenId, doAgree: boolean) {
        doAgree ? this._pertinence.agree() : this._pertinence.disagree();
        this._voterList.add(voterId, doAgree);
    }

    public editMessage(newMessage: string): void {
        this._message = new AlertMessage(newMessage, new Date());
    }

    public get message(): AlertMessage {
        return this._message;
    }
    public get pertinence(): PertinenceScore {
        return this._pertinence;
    }
    public get voterList(): VoterList {
        return this._voterList;
    }

    toJSON() {
        return {
            ...super.toJSON(),
            message: this.message,
            voterList: Array.from(this._voterList.list),
            pertinence: this._pertinence.toJSON(),
        };
    }
}

export default AlertHotspot;
