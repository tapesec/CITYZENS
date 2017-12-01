import Author from '../author/Author';
class Message {

    constructor(
        private _id : string,
        private _title : string,
        private _author : Author,
        private _pinned : boolean,
        private _createdAt : Date,
        private _updatedAt? : Date) {}

    get id() : string {
        return this._id;
    }

    get title() : string {
        return this._title;
    }



    get author() : Author {
        return this._author;
    }

    get pinned() : boolean {
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
            id: this.id,
            title: this.title,
            author: this.author,
            pinned: this.pinned,
            createdAt: this.createdAt,
            updatedAt: this.updatedAt,
        };
    }

}
export default Message;
