/**
 * a test suite for easily valid json schema
 */
import * as ajv from 'ajv';
import { expect } from 'chai';
import getCreateHotspotSchema from '../../../../src/api/requestValidation/createHotspotsSchema';
import getUpdateHotspotSchema, {
    patchAlertHotspotSchema,
    patchMediaHotspotSchema,
} from '../../../../src/api/requestValidation/patchHotspotsSchema';
import { getHotspots, patchMessageSchema } from '../../../../src/api/requestValidation/schema';
import { HotspotType } from '../../../../src/domain/hotspot/Hotspot';

describe('JschemaValidator', () => {
    let validator: ajv.Ajv;

    before(() => {
        validator = new ajv();
    });

    it('should validate a WallHotspot schema', () => {
        // Arrange
        const body = {
            title: 'my new hotspot',
            position: {
                latitude: 12.23323,
                longitude: 22.1112221,
            },
            cityId: '33273',
            scope: 'private',
            address: {
                city: 'Isengard',
                name: 'Tower of Saruman',
            },
            type: HotspotType.Media,
        };
        // Act
        const isValid = validator.validate(getCreateHotspotSchema(), body);
        // Assert
        expect(validator.errorsText()).to.be.equal('No errors');
        expect(isValid).to.be.true;
    });

    it('should validate a GET /hotspots by area', () => {
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

    it('should validate a GET /hotspots by insee', () => {
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

    it('should not validate different querystrings combination', () => {
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

    it('should not validate incomplete querystrings', () => {
        // Arrange
        const queryStrings = {
            north: 22.23232,
        };
        // Act
        const isValid = validator.validate(getHotspots, queryStrings);
        // Assert
        expect(isValid).to.be.false;
    });

    it('should not validate valid querystrings plus additionnal property', () => {
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

    it('should validate a message patch body with all properties to update', () => {
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

    it('should validate a message patch body with only one property to update', () => {
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

    it('should reject a message patch body with no given required property', () => {
        // Arrange
        const body = {
            foo: 'bar',
        };
        // Act
        const isValid = validator.validate(patchMessageSchema, body);
        // Assert
        expect(isValid).to.be.false;
    });

    it('should validate WallHotspot data with schema built with merge mecanism', () => {
        // Arrange
        const body = {
            title: 'my new hotspot',
            position: {
                latitude: 12.23323,
                longitude: 22.1112221,
            },
            address: {
                city: 'Minas Tirith',
                name: 'Devant les portes',
            },
            cityId: '33273',
            scope: 'private',
            type: HotspotType.Media,
        };
        // Act
        const isValid = validator.validate(getCreateHotspotSchema(), body);
        // Assert
        expect(validator.errorsText()).to.be.equal('No errors');
        expect(isValid).to.be.true;
    });
    it('should validate WallHotspot complete set of data with schema built with merge mecanism', () => {
        // Arrange
        const body = {
            title: 'my new hotspot',
            position: {
                latitude: 12.23323,
                longitude: 22.1112221,
            },
            address: {
                city: 'Minas Tirith',
                name: 'Forum',
            },
            cityId: '33273',
            scope: 'private',
            type: HotspotType.Media,
            avatarIconUrl: 'url',
        };
        // Act
        const isValid = validator.validate(getCreateHotspotSchema(), body);
        // Assert
        expect(validator.errorsText()).to.be.equal('No errors');
        expect(isValid).to.be.true;
    });

    it('should validate EventHotspot data with schema built with merge mecanism', () => {
        // Arrange
        const body = {
            title: 'my new hotspot',
            position: {
                latitude: 12.23323,
                longitude: 22.1112221,
            },
            address: {
                city: 'Comté',
                name: 'Cul de sac',
            },
            cityId: '33273',
            scope: 'private',
            type: HotspotType.Media,
        };
        // Act
        const isValid = validator.validate(getCreateHotspotSchema(), body);
        // Assert
        expect(validator.errorsText()).to.be.equal('No errors');
        expect(isValid).to.be.true;
    });
    it('should validate EventHotspot complete set of data with schema built with merge mecanism', () => {
        // Arrange
        const body = {
            title: 'my new hotspot',
            position: {
                latitude: 12.23323,
                longitude: 22.1112221,
            },
            address: {
                city: "Je n'ai plus de nom",
                name: 'Peu importe',
            },
            cityId: '33273',
            scope: 'private',
            type: HotspotType.Media,
            avatarIconUrl: 'url',
        };
        // Act
        const isValid = validator.validate(getCreateHotspotSchema(), body);
        // Assert
        expect(validator.errorsText()).to.be.equal('No errors');
        expect(isValid).to.be.true;
    });

    it('should validate AlertHotspot data with schema built with merge mecanism', () => {
        // Arrange
        const body = {
            position: {
                latitude: 12.23323,
                longitude: 22.1112221,
            },
            address: {
                city: 'Gondor',
                name: "La tombe de Boromir (le fleuve en vrai parcequ'il n'a pas de tombe",
            },
            cityId: '33273',
            type: HotspotType.Alert,
            message: 'lorem ipsum dolor',
        };
        // Act
        const isValid = validator.validate(getCreateHotspotSchema(), body);
        // Assert
        expect(validator.errorsText()).to.be.equal('No errors');
        expect(isValid).to.be.true;
    });

    it("should'nt validate if type is not the same as the body properties", () => {
        // Arrange
        const body = {
            position: {
                latitude: 12.23323,
                longitude: 22.1112221,
            },
            cityId: '33273',
            type: HotspotType.Media, // <-- type is for EventHotspot
            message: 'lorem ipsum dolor', // <-- but message for alert hotspot
        };
        // Act
        const isValid = validator.validate(getCreateHotspotSchema(), body);
        // Assert
        expect(isValid).to.be.false;
    });

    it('should validate AlertHotspot message update with corresponding schema', () => {
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

    it('should validate WallHotspot update with corresponding schema', () => {
        // Arrange
        const body = {
            title: 'an edited title',
            scope: 'private',
            avatarIconUrl: 'new url',
        };
        // Act
        const isValid = validator.validate(getUpdateHotspotSchema(), body);
        // Assert
        expect(validator.errorsText()).to.be.equal('No errors');
        expect(isValid).to.be.true;
    });

    it('should validate MediaHotspot update with corresponding schema', () => {
        // Arrange
        const body = {
            title: 'an edited title',
            scope: 'private',
            avatarIconUrl: 'new url',
        };
        // Act
        const isValid = validator.validate(getUpdateHotspotSchema(), body);
        // Assert
        expect(validator.errorsText()).to.be.equal('No errors');
        expect(isValid).to.be.true;
    });

    it("should'nt validate anything if no body is provided", () => {
        // Arrange
        const body = {};
        // Act
        const isValid = validator.validate(getUpdateHotspotSchema(), body);
        // Assert
        expect(isValid).to.be.false;
    });

    it("Shouldn't validate AlertHotspot patch on AvatarIconUrl", () => {
        const body = { avatarIconUrl: 'nex icon' };

        const isValid = validator.validate(patchAlertHotspotSchema, body);
        expect(isValid, validator.errorsText()).to.be.false;
    });
    it('Should validate MediaHotspot patch on AvatarIconUrl', () => {
        const body = { avatarIconUrl: 'nex icon' };

        const isValid = validator.validate(patchMediaHotspotSchema, body);
        expect(isValid, validator.errorsText()).to.be.true;
    });
});
