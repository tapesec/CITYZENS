/**
 * a test suite for easily valid json schema
 */
import * as ajv from 'ajv';
import { expect } from 'chai';
const hotspotSchema = require('../../../src/api/requestValidation/createHotspotValidation.json');

describe('JschemaValidator', () => {

    let validator : ajv.Ajv;

    before(() => {
        validator = new ajv();
    });

    it ('should validate a basic schema', () => {
        const body = {
            title: 'my new hotspot',
            coords: {
                lat: 12.23323,
                lng: 22.1112221,
            },
            message: 'a classic message',
            newAttr: 'random value',
        };

        const isValid = validator.validate(hotspotSchema, body);
        expect(validator.errorsText()).to.be.equal('No errors');
        expect(isValid).to.be.true;
    });

});
