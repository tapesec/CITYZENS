import Cityzen from '../../../../../src/domain/cityzens/model/Cityzen';
import cityzenFromJwt,
{ InvalidPayloadError } from '../../../../../src/api/services/cityzen/cityzenFromJwt';
import DecodedJwtPayload from '../../../../../src/api/services/auth/DecodedJwtPayload';
import { DECODED_PAYLOAD, MALFORMED_DECODED_PAYLOAD } from '../samples';
import { expect } from 'chai';

describe('CityzenFromJwt', () => {
    it ('should create and return a cityzen', () => {
        // Arrange
        const decodedJwtPayload: DecodedJwtPayload = DECODED_PAYLOAD;
        // Act
        const cityzen: Cityzen = cityzenFromJwt(decodedJwtPayload);
        // Assert
        expect(cityzen.favoritesHotspots.size).to.equal(1);
        expect(cityzen).to.have.property('favoritesHotspots');
        expect(cityzen).to.have.property('id');
        expect(cityzen).to.have.property('email');
        expect(cityzen).to.have.property('pseudo');
    });

    // TODO
    it ('should throw an error if payload is malformed', () => {
        // Arrange
        const malformedPayload: DecodedJwtPayload = MALFORMED_DECODED_PAYLOAD;
        // Act

        // Assert
        expect(() => { cityzenFromJwt(malformedPayload); })
        .to.throw('no subject found in jwt decoded payload');
    });
});
