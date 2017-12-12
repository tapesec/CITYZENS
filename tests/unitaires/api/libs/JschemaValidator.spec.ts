/**
 * a test suite for easily valid json schema
 */
import {
    HotspotType,
    HotspotIconType,
} from '../../../../src/domain/cityLife/model/hotspot/Hotspot';
import * as ajv from 'ajv';
import { expect } from 'chai';
import {
    createHospotSchema,
    patchMessageSchema,
    getHotspots,
} from '../../../../src/api/requestValidation/schema';

describe('JschemaValidator', () => {

    let validator : ajv.Ajv;

    before(() => {
        validator = new ajv();
    });

    it ('should validate a WallHotspot schema', () => {
        // Arrange
        const body = {
            title: 'my new hotspot',
            position: {
                latitude: 12.23323,
                longitude: 22.1112221,
            },
            cityId: '33273',
            message: 'a classic message',
            newAttr: 'random value',
            scope: 'private',
            type: HotspotType.WallMessage,
            iconType: HotspotIconType.Wall,
        };
        // Act
        const isValid = validator.validate(createHospotSchema, body);
        // Assert
        expect(validator.errorsText()).to.be.equal('No errors');
        expect(isValid).to.be.true;
    });

    it ('should validate a GET /hotspots by area', () => {
        // Arrange
        const queryStrings = {
            north: 12.123345,
            west: 22.121223,
            south: -3.12342123,
            east: 2,
        };
        // Act
        const isValid = validator.validate(getHotspots, queryStrings);
        // Assert
        expect(validator.errorsText()).to.be.equal('No errors');
        expect(isValid).to.be.true;
    });

    it ('should validate a GET /hotspots by code commune (INSEE)', () => {
        // Arrange
        const queryStrings = {
            insee: '33273',
        };
        // Act
        const isValid = validator.validate(getHotspots, queryStrings);
        // Assert
        expect(validator.errorsText()).to.be.equal('No errors');
        expect(isValid).to.be.true;
    });

    it ('should not validate different querystrings combination', () => {
        // Arrange
        const queryStrings = {
            insee: '33273',
            north: 22.23232,
        };
        // Act
        const isValid = validator.validate(getHotspots, queryStrings);
        // Assert
        expect(isValid).to.be.false;
    });

    it ('should not validate incomplete querystrings', () => {
        // Arrange
        const queryStrings = {
            north: 22.23232,
        };
        // Act
        const isValid = validator.validate(getHotspots, queryStrings);
        // Assert
        expect(isValid).to.be.false;
    });

    it ('should not validate valid querystrings plus additionnal property', () => {
        // Arrange
        const queryStrings = {
            insee: '33273',
            foo: 22.23232,
        };
        // Act
        const isValid = validator.validate(getHotspots, queryStrings);
        // Assert
        expect(isValid).to.be.false;
    });

    it ('should validate a message patch body with all properties to update', () => {
        const body = {
            title: 'test title',
            body: 'lorem ipsum',
            pinned: false,
        };

        const isValid = validator.validate(patchMessageSchema, body);
        expect(validator.errorsText()).to.be.equal('No errors');
        expect(isValid).to.be.true;
    });

    it ('should validate a message patch body with only one property to update', () => {
        const body = {
            title: 'test title',
        };

        const isValid = validator.validate(patchMessageSchema, body);
        expect(validator.errorsText()).to.be.equal('No errors');
        expect(isValid).to.be.true;
    });

    it ('should reject a message patch body with no given required property', () => {
        const body = {
            foo: 'bar',
        };
        const isValid = validator.validate(patchMessageSchema, body);
        expect(isValid).to.be.false;
    });
});
