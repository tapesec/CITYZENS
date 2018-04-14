import MediaBuilder from '../../factories/MediaBuilder';
import MediaHotspot from './MediaHotspot';
import HotspotBuilder from '../../factories/HotspotBuilder';
import EventDescription from './EventDescription';

class EventHotspot extends MediaHotspot {
    constructor(
        hotpotBuilder: HotspotBuilder,
        mediaBuilder: MediaBuilder,
        protected _date_end: Date,
        protected _description: EventDescription,
    ) {
        super(hotpotBuilder, mediaBuilder);
    }

    public get dateEnd(): Date {
        return this._date_end;
    }

    public reportDateEnd(newDate: Date): void {
        this._date_end = newDate;
    }

    public get description(): EventDescription {
        return this._description;
    }

    editDescription(newDescription: string): void {
        this._description = new EventDescription(newDescription, new Date());
    }

    toJSON() {
        return {
            ...super.toJSON(),
            dateEnd: this.dateEnd,
            description: this.description,
        };
    }
}

export default EventHotspot;
