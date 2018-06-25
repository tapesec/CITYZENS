import Author from '../author/Author';
import HotspotId from '../hotspot/HotspotId';
import MessageId from './MessageId';

class Message {
    constructor(
        private _id: MessageId,
        private _title: string,
        private _body: string,
        private _author: Author,
        private _pinned: boolean,
        private _hotspotId: HotspotId,
        private _parentId: MessageId,
        private _createdAt: Date,
        private _updatedAt?: Date,
    ) {}

    public changeTitle = (title: string): void => {
        this._title = title;
        this._updatedAt = new Date();
    };

    public editBody = (body: string): void => {
        this._body = body;
        this._updatedAt = new Date();
    };

    public togglePinMode = (): void => {
        this._pinned = !this.pinned;
    };

    get parentId(): MessageId {
        return this._parentId;
    }

    get id(): MessageId {
        return this._id;
    }

    get hotspotId(): HotspotId {
        return this._hotspotId;
    }

    get title(): string {
        return this._title;
    }

    get body(): string {
        return this._body;
    }

    get author(): Author {
        return this._author;
    }

    get pinned(): boolean {
        return this._pinned;
    }

    get createdAt() {
        return this._createdAt;
    }

    get updatedAt() {
        return this._updatedAt;
    }

    toJSON() {
        return {
            id: this.id.toString(),
            title: this.title,
            body: this.body,
            author: this.author.toJSON(),
            hotspotId: this.hotspotId.toString(),
            pinned: this.pinned,
            parentId: this.parentId,
            createdAt: this.createdAt,
            updatedAt: this.updatedAt,
        };
    }
}
export default Message;
