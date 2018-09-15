import ValueObject from '../interface/ValueObject';
import * as lodash from 'lodash';

class PertinenceScore implements ValueObject {
    constructor(private _agree: number, private _disagree: number) {}

    public agree() {
        this._agree += 1;
    }
    public disagree() {
        this._disagree += 1;
    }

    get nAgree() {
        return this._agree;
    }

    get nDisagree() {
        return this._disagree;
    }

    get nVote() {
        return this.nAgree + this.nDisagree;
    }

    get percent() {
        return this.nAgree / this.nVote;
    }

    get isRelevant() {
        // For now, very simple algorithm
        return this.percent > 0.7;
    }

    public isEqual(other: PertinenceScore) {
        return lodash.isEqual(this, other);
    }
}

export default PertinenceScore;
