import Cityzen from '../../../../../src/domain/cityzens/model/Cityzen';
import cityzenFromJwt from '../../../../../src/api/services/cityzen/cityzenFromJwt';
import DecodedJwtPayload from '../../../../../src/api/services/auth/DecodedJwtPayload';
import { DECODED_PAYLOAD } from '../samples';
import { expect } from 'chai';

describe('CityzenFromJwt', () => {
    it ('should create and return a cityzen', () => {
        // Arrange
        const decodedJwtPayload : DecodedJwtPayload = DECODED_PAYLOAD;
        // Act
        const cityzen : Cityzen = cityzenFromJwt(decodedJwtPayload);
        // Assert
        expect(cityzen.favoritesHotspots).to.have.lengthOf(1);
        expect(cityzen).to.have.property('favoritesHotspots');
        expect(cityzen).to.have.property('id');
        expect(cityzen).to.have.property('email');
        expect(cityzen).to.have.property('pseudo');
    });
});
