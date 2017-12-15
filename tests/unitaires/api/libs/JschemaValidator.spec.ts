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
    patchMessageSchema,
    getHotspots,
} from '../../../../src/api/requestValidation/schema';
import getCreateHotspotSchema from '../../../../src/api/requestValidation/createHotspotsSchema';
import getUpdateHotspotSchema from '../../../../src/api/requestValidation/patchHotspotsSchema';

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
            scope: 'private',
            type: HotspotType.WallMessage,
            iconType: HotspotIconType.Wall,
        };
        // Act
        const isValid = validator.validate(getCreateHotspotSchema(), body);
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
        // Arrange
        const body = {
            title: 'test title',
            body: 'lorem ipsum',
            pinned: false,
        };
        // Act
        const isValid = validator.validate(patchMessageSchema, body);
        // Assert
        expect(validator.errorsText()).to.be.equal('No errors');
        expect(isValid).to.be.true;
    });

    it ('should validate a message patch body with only one property to update', () => {
        // Arrange
        const body = {
            title: 'test title',
        };
        // Act
        const isValid = validator.validate(patchMessageSchema, body);
        // Assert
        expect(validator.errorsText()).to.be.equal('No errors');
        expect(isValid).to.be.true;
    });

    it ('should reject a message patch body with no given required property', () => {
        // Arrange
        const body = {
            foo: 'bar',
        };
        // Act
        const isValid = validator.validate(patchMessageSchema, body);
        // Assert
        expect(isValid).to.be.false;
    });

    it ('should validate WallHotspot data with schema built with merge mecanism', () => {
        // Arrange
        const body = {
            title: 'my new hotspot',
            position: {
                latitude: 12.23323,
                longitude: 22.1112221,
            },
            cityId: '33273',
            scope: 'private',
            type: HotspotType.WallMessage,
            iconType: HotspotIconType.Wall,
        };
        // Act
        const isValid = validator.validate(getCreateHotspotSchema(), body);
        // Assert
        expect(validator.errorsText()).to.be.equal('No errors');
        expect(isValid).to.be.true;
    });

    it ('should validate EventHotspot data with schema built with merge mecanism', () => {
        // Arrange
        const body = {
            title: 'my new hotspot',
            position: {
                latitude: 12.23323,
                longitude: 22.1112221,
            },
            cityId: '33273',
            scope: 'private',
            type: HotspotType.WallMessage,
            iconType: HotspotIconType.Wall,
            dateEnd: new Date().toISOString(),
            description: 'lorem ipsum dolor',
        };
        // Act
        const isValid = validator.validate(getCreateHotspotSchema(), body);
        // Assert
        expect(validator.errorsText()).to.be.equal('No errors');
        expect(isValid).to.be.true;
    });

    it ('should validate AlertHotspot data with schema built with merge mecanism', () => {
        // Arrange
        const body = {
            position: {
                latitude: 12.23323,
                longitude: 22.1112221,
            },
            cityId: '33273',
            type: HotspotType.Alert,
            iconType: HotspotIconType.Accident,
            message: 'lorem ipsum dolor',
        };
        // Act
        const isValid = validator.validate(getCreateHotspotSchema(), body);
        // Assert
        expect(validator.errorsText()).to.be.equal('No errors');
        expect(isValid).to.be.true;
    });

    it ('should validate AlertHotspot update with corresponding schema', () => {
        // Arrange
        const body = {
            message: 'the message was updated',
        };
        // Act
        const isValid = validator.validate(getUpdateHotspotSchema(), body);
        // Assert
        expect(validator.errorsText()).to.be.equal('No errors');
        expect(isValid).to.be.true;
    });

    it ('should validate WallHotspot update with corresponding schema', () => {
        // Arrange
        const body = {
            title: 'an edited title',
            scope: 'private',
        };
        // Act
        const isValid = validator.validate(getUpdateHotspotSchema(), body);
        // Assert
        expect(validator.errorsText()).to.be.equal('No errors');
        expect(isValid).to.be.true;
    });

    it ('should validate EventHotspot update with corresponding schema', () => {
        // Arrange
        const body = {
            title: 'an edited title',
            scope: 'private',
            dateEnd: new Date().toISOString(),
            description: 'an edited description',
        };
        // Act
        const isValid = validator.validate(getUpdateHotspotSchema(), body);
        // Assert
        expect(validator.errorsText()).to.be.equal('No errors');
        expect(isValid).to.be.true;
    });

    it ('should\'nt validate anything if no body is provided', () => {
        // Arrange
        const body = {};
        // Act
        const isValid = validator.validate(getUpdateHotspotSchema(), body);
        // Assert
        expect(isValid).to.be.false;
    });
});
