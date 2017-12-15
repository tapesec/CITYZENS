import AlertMessage from './AlertMessage';
import HotspotBuilder from '../../factories/HotspotBuilder';
import CityId from '../city/CityId';
import HotspotId from './HotspotId';
import Author from '../author/Author';
import Hotspot, { HotspotScope, HotspotType, HotspotIconType } from './Hotspot';
import Position from './Position';
import Address from './Address';

class AlertHotspot extends Hotspot {

    constructor(
        hotpotBuilder: HotspotBuilder,
        protected _message: AlertMessage,
    ) {
        super(hotpotBuilder);
    }

    public editMessage(newMessage: string): void {
        this._message = new AlertMessage(newMessage, new Date());
    }

    public get message(): AlertMessage {
        return this._message;
    }

    toJSON() {
        return {
            ...super.toString(),
            message: this.message,
        };
    }
}

export default AlertHotspot;
