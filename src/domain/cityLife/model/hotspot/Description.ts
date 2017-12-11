class Description {
    constructor(
        private _description: string,
        private _createdAt: Date,
        private _updatedAt?: Date,
    ) {}

    get description(): string {
        return this._description;
    }

    get createdAt(): Date {
        return this._createdAt;
    }

    get updatedAt(): Date {
        return this.updatedAt;
    }

    toJSON() {
        return {
            description: this.description,
            createdAt: this.createdAt,
            updatedAt: this.updatedAt,
        };
    }
}

export default Description;
