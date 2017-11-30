import JwtParser from '../../../../src/api/services/auth/JwtParser';
import * as TypeMoq from 'typemoq';
import { expect } from 'chai';
import * as sinon from 'sinon';

describe('JwtParser', () => {
    it('should decode a valid jwt with correct option', async () => {
        // Arrange
        const secret = 'my-secret-key';
        const token = 'fake.jwt.token';
        const options = {
            algorithms: ['HS256'],
        };
        const jwtLibMoq = {
            verify: sinon.stub(),
        };
        jwtLibMoq.verify.callsArg(3);
        
        // Act
        const jwtParser = new JwtParser(jwtLibMoq, secret);
        await jwtParser.verify(token);

        // Assert
        expect(jwtLibMoq.verify.calledOnce).to.be.true;
        expect(jwtLibMoq.verify.calledWith(token, secret, options)).to.be.true;
    });
});
