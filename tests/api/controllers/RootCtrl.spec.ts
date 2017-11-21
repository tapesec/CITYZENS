import { Response } from '_debugger';
import DecodedJwtPayload from '../../../src/api/services/auth/DecodedJwtPayload';
import * as rest from 'restify';
import JwtParser from '../../../src/api/services/auth/JwtParser';
import RootCtrl from '../../../src/api/controllers/RootCtrl';
import { expect } from 'chai';
import * as TypeMoq from 'typemoq';
const restifyErrors = require('restify-errors');

describe('RootCtrl', () => {

    let jwtParser : TypeMoq.IMock<JwtParser>;
    let reqMoq : TypeMoq.IMock<rest.Request>;
    let resMoq : TypeMoq.IMock<rest.Response>;
    let nextMoq : TypeMoq.IMock<rest.Next>;
    let token : string;

    beforeEach(() => {
        jwtParser = TypeMoq.Mock.ofType<JwtParser>();
        reqMoq = TypeMoq.Mock.ofType<rest.Request>();
        resMoq = TypeMoq.Mock.ofType<rest.Response>();
        nextMoq = TypeMoq.Mock.ofType<rest.Next>();
        token = 'javascript.web.token';
    });

    it.only(
        'should load an authorized cityzen according to given token passed by http header',
        async () => {
            // Arrange
            reqMoq.setup(x => x.header('Authorization')).returns(() => `Bearer ${token}`);
            const fakeJwtPayload = {
                sub: 'auth0|fake-id',
                email: 'test@domain.com',
                nickname: 'test',
                user_metadata: {
                    foo: 'bar',
                },
            };
            const decodedJwtPayload = new DecodedJwtPayload(fakeJwtPayload, undefined);
            jwtParser.setup(x => x.verify(token))
            .returns(() => Promise.resolve(fakeJwtPayload));
            // Act
            const rootCtrl = new RootCtrl(jwtParser.object);
            await rootCtrl.loadAuthenticatedUser(reqMoq.object, resMoq.object, nextMoq.object);
            // Assert
            reqMoq.verify(x => x.header('Authorization'), TypeMoq.Times.exactly(2));
            jwtParser.verify(x => x.verify(token), TypeMoq.Times.once());
            nextMoq.verify(x => x(), TypeMoq.Times.once());
            expect(rootCtrl.decodeJwtPayload)
            .to.be.eql(decodedJwtPayload);
        },
    );

    it(
        'should return unauthorized error if no http Authorization header provider',
        async () => {
            // Arrange
            reqMoq.setup(x => x.header('Authorization')).returns(() => undefined);
            jwtParser.setup(x => x.verify(token))
            .returns(() => Promise.resolve({ email: 'test@domain.com', nickname: 'test' }));
            // Act
            const rootCtrl = new RootCtrl(jwtParser.object);
            await rootCtrl.loadAuthenticatedUser(reqMoq.object, resMoq.object, nextMoq.object);
            // Assert
            reqMoq.verify(x => x.header('Authorization'), TypeMoq.Times.exactly(1));
            jwtParser.verify(x => x.verify(token), TypeMoq.Times.exactly(0));
            nextMoq.verify(
                x => x(new restifyErrors.UnauthorizedError('Token must be provided')),
                TypeMoq.Times.once(),
            );
        },
    );

    it(
        'should return unauthorized error if access token is invalid',
        async () => {
            // Arrange
            const decodeError = { message: 'Invalid token' };
            reqMoq.setup(x => x.header('Authorization')).returns(() => `Bearer ${token}`);
            jwtParser.setup(x => x.verify(token))
            .returns(() => Promise.reject(decodeError));
            // Act
            const rootCtrl = new RootCtrl(jwtParser.object);
            await rootCtrl.loadAuthenticatedUser(reqMoq.object, resMoq.object, nextMoq.object);
            // Assert
            reqMoq.verify(x => x.header('Authorization'), TypeMoq.Times.exactly(2));
            jwtParser.verify(x => x.verify(token), TypeMoq.Times.exactly(1));
            nextMoq.verify(
                x => x(new restifyErrors.UnauthorizedError(decodeError.message)),
                TypeMoq.Times.once(),
            );
        },
    );
});
