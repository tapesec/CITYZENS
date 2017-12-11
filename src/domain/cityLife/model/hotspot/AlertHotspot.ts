import HotspotBuilder from '../../factories/HotspotBuilder';
import CityId from '../city/CityId';
import HotspotId from './HotspotId';
import Description from './Description';
import Author from '../author/Author';
import Hotspot, { HotspotScope, HotspotType, HotspotIconType } from './Hotspot';
import Position from './Position';
import Address from './Address';

class AlertHotspot extends Hotspot {

    constructor(
        hotpotBuilder: HotspotBuilder,
        protected _description: Description,
    ) {
        super(hotpotBuilder);
    }

    public editDescription(newDescription: string): void {
        this._description = new Description(newDescription, this.description.createdAt, new Date());
    }

    public get description(): Description {
        return this._description;
    }

    toJSON() {
        return {
            ...super.toString(),
            description: this._description,
        };
    }
}

export default AlertHotspot;
