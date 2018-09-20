import Cityzen from '../../../../src/application/domain/cityzen/Cityzen';
import DecodedJwtPayload from '../../../../src/api/services/auth/DecodedJwtPayload';
import { expect } from 'chai';
describe('AuthorizedCityzen service', () => {

    it('should instanciate a cityzen according a given description', () => {
        // Arrange
        const payload = {
            sub: 'auth0|fake-id',
            email: 'test@domain.com',
            nickname: 'toto',
            description: 'dummy description',
        };
        const fakeNamespace = 'http://www.fake.namespace.com';
        // Act
        const decodedJwtPayload : DecodedJwtPayload = new DecodedJwtPayload(payload, fakeNamespace);
        // Act
        expect(decodedJwtPayload.sub).to.be.equal(payload.sub);
        expect(decodedJwtPayload.email).to.be.equal(payload.email);
        expect(decodedJwtPayload.nickname).to.be.equal(payload.nickname);
    });
});
