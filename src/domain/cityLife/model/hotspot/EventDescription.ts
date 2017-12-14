class EventDescription {
    constructor(
        private _content: string,
        private _updatedAt?: Date,
    ) {}

    get content() {
        return this._content;
    }

    get updatedAt() {
        return this._updatedAt;
    }

    toJSON() {
        return {
            content: this.content,
            updatedAt: this._updatedAt,
        };
    }
}
export default EventDescription;
