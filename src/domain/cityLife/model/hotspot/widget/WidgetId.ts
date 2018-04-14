import ValueObject from '../../../../interface/ValueObject';
import * as lodash from 'lodash';

class WidgetId implements ValueObject {
    constructor(private _id: string) {}

    public toString() {
        return this._id;
    }

    public isEqual(other: WidgetId) {
        return lodash.isEqual(this, other);
    }
}
export default WidgetId;
