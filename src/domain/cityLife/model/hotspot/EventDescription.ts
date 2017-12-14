class EventDescription {
    constructor(
        private _content: string,
        private _updatedAt?: string,
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
