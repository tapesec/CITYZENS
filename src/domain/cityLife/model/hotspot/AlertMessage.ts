class AlertMessage {
    constructor(private _content: string, private _updatedAt: Date) {}

    get content(): string {
        return this._content;
    }

    get updatedAt(): Date {
        return this._updatedAt;
    }

    toJSON() {
        return {
            content: this.content,
            updatedAt: this.updatedAt,
        };
    }
}
export default AlertMessage;
