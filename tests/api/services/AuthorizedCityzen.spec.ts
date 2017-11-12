import Cityzen from '../../../src/domain/cityzens/model/Cityzen';
import AuthorizedCityzen from '../../../src/api/services/auth/AuthorizedCityzen';
import { expect } from 'chai';
describe('AuthorizedCityzen service', () => {

    it('should instanciate a cityzen according a given description', () => {
        // Arrange
        const payload = {
            email: 'test@domain.com',
            nickname: 'toto',
            description: 'dummy description',
        };
        // Act
        const grantedCityzen : Cityzen = new AuthorizedCityzen(payload).load();
        // Act
        expect(grantedCityzen.description).to.be.equal(payload.description);
        expect(grantedCityzen.email).to.be.equal(payload.email);
        expect(grantedCityzen.pseudo).to.be.equal(payload.nickname);
    });
});
