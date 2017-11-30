/**
 * a test suite for easily valid json schema
 */
import * as ajv from 'ajv';
import { expect } from 'chai';
import { createHospotSchema } from '../../../../src/api/requestValidation/createHotspotValidation';

describe('JschemaValidator', () => {

    let validator : ajv.Ajv;

    before(() => {
        validator = new ajv();
    });

    it ('should validate a basic schema', () => {
        const body = {
            title: 'my new hotspot',
            position: {
                latitude: 12.23323,
                longitude: 22.1112221,
            },
            id_city: '33273',
            message: 'a classic message',
            newAttr: 'random value',
            scope: 'private',
        };

        const isValid = validator.validate(createHospotSchema, body);
        expect(validator.errorsText()).to.be.equal('No errors');
        expect(isValid).to.be.true;
    });

});
