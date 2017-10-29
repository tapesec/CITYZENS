class Content {

    protected _message : string;
    protected _createdAt : Date;
    protected _updatedAt : Date;

    constructor(message : string, createdAt : Date, updatedAt? : Date) {
        this._message = message;
        this._createdAt = createdAt;
        this._updatedAt = updatedAt;
    }

    get message() : string {
        return this._message;
    }

    get createdAt() : Date {
        return this._createdAt;
    }

    get updatedAt() : Date {
        return this._updatedAt;
    }

    toJSON() {
        return {
            message: this.message,
        };
    }
}
export default Content;
