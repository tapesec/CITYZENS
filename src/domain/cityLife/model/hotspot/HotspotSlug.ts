import ValueObject from './../../../interface/ValueObject';

class HotspotSlug implements ValueObject {
    constructor(private _slug: string) {}

    get slug(): string {
        return this._slug;
    }

    toString(): string {
        return this._slug;
    }

    isEqual(other: HotspotSlug) {
        return other.slug === this.slug;
    }
}
export default HotspotSlug;
