import AlertMessage from './AlertMessage';
import HotspotBuilder from '../../factories/HotspotBuilder';
import Hotspot from './Hotspot';

class AlertHotspot extends Hotspot {
    constructor(
        hotpotBuilder: HotspotBuilder,
        protected _message: AlertMessage,
        protected _pertinence: PertinenceScore,
    ) {
        super(hotpotBuilder);
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

    toJSON() {
        return {
            ...super.toString(),
            message: this.message,
        };
    }
}

export default AlertHotspot;
