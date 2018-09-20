import CityzenId from '../cityzen/CityzenId';
import HotspotBuilder from './HotspotBuilder';
import AlertMessage from './AlertMessage';
import Hotspot from './Hotspot';
import ImageLocation from './ImageLocation';
import PertinenceScore from './PertinenceScore';
import VoterList from './VoterList';

class AlertHotspot extends Hotspot {
    constructor(
        hotpotBuilder: HotspotBuilder,
        protected _message: AlertMessage,
        protected _pictureDescription: ImageLocation,
        protected _pertinence: PertinenceScore,
        protected _voterList: VoterList,
    ) {
        super(hotpotBuilder);
    }

    public addVoter(voterId: CityzenId, doAgree: boolean) {
        doAgree ? this._pertinence.agree() : this._pertinence.disagree();
        this._voterList.add(voterId, doAgree);
    }

    public get pictureDescription(): ImageLocation {
        return this._pictureDescription;
    }

    public addImageDescription(url: string): void {
        this._pictureDescription = new ImageLocation(url);
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
            pictureDescription: this.pictureDescription
                ? this.pictureDescription.toString()
                : undefined,
            pertinence: {
                agree: this.pertinence.nAgree,
                disagree: this.pertinence.nDisagree,
            },
        };
    }
}

export default AlertHotspot;
