import ValueObject from '../ValueObject';

class PostalCode implements ValueObject {
    constructor(private _postalCode: string) {}

    get postalCode(): string {
        return this._postalCode;
    }

    toString() {
        return this.postalCode;
    }

    public isEqual(other: PostalCode) {
        return other.postalCode === this.postalCode;
    }
}
export default PostalCode;
