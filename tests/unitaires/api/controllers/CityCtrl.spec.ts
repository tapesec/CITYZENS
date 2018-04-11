import { CityRepositoryInMemory } from './../../../../src/infrastructure/CityRepositoryInMemory';
import * as TypeMoq from 'typemoq';
import * as Rest from 'restify';
import City from '../../../../src/domain/cityLife/model/city/City';
import Position from '../../../../src/domain/cityLife/model/hotspot/Position';
import CityCtrl from '../../../../src/api/controllers/CityCtrl';
import ErrorHandler from '../../../../src/api/services/errors/ErrorHandler';
import Auth0Service from '../../../../src/api/services/auth/Auth0Service';

describe('CityCtrl', () => {
    let cityRepositoryMoq: TypeMoq.IMock<CityRepositoryInMemory>;
    let errorHandlerMoq: TypeMoq.IMock<ErrorHandler>;
    let auth0ServiceMoq: TypeMoq.IMock<Auth0Service>;
    let reqMoq: TypeMoq.IMock<Rest.Request>;
    let resMoq: TypeMoq.IMock<Rest.Response>;
    let nextMoq: TypeMoq.IMock<Rest.Next>;

    before(() => {
        cityRepositoryMoq = TypeMoq.Mock.ofType<CityRepositoryInMemory>();
        errorHandlerMoq = TypeMoq.Mock.ofType();
        reqMoq = TypeMoq.Mock.ofType();
        resMoq = TypeMoq.Mock.ofType();
        nextMoq = TypeMoq.Mock.ofType();
        auth0ServiceMoq = TypeMoq.Mock.ofType();
    });
    afterEach(() => {
        cityRepositoryMoq.reset();
        errorHandlerMoq.reset();
        auth0ServiceMoq.reset();
        reqMoq.reset();
        resMoq.reset();
        nextMoq.reset();
    });

    it('Sould return asked City', () => {
        const askedCity = new City('', '', new Position(0, 0), []);
        const params = {
            slug: 'slug',
        };

        reqMoq.setup(x => x.params).returns(() => params);

        cityRepositoryMoq.setup(x => x.findBySlug(params.slug)).returns(() => askedCity);

        new CityCtrl(errorHandlerMoq.object, auth0ServiceMoq.object, cityRepositoryMoq.object).city(
            reqMoq.object,
            resMoq.object,
            nextMoq.object,
        );

        resMoq.verify(x => x.json(200, askedCity), TypeMoq.Times.once());
    });

    it('Sould return error not found', () => {
        const askedCity = undefined;
        const params = {
            slug: 'slug',
        };

        reqMoq.setup(x => x.params).returns(() => params);

        cityRepositoryMoq.setup(x => x.findBySlug(params.slug)).returns(() => askedCity);
        errorHandlerMoq
            .setup(x => x.logAndCreateNotFound(TypeMoq.It.isAny(), TypeMoq.It.isAny()))
            .returns(() => 'error');

        new CityCtrl(errorHandlerMoq.object, auth0ServiceMoq.object, cityRepositoryMoq.object).city(
            reqMoq.object,
            resMoq.object,
            nextMoq.object,
        );

        nextMoq.verify(x => x('error'), TypeMoq.Times.once());
    });

    it('Sould return internal error', () => {
        const askedCity = undefined;
        const params = {
            slug: 'slug',
        };

        reqMoq.setup(x => x.params).returns(() => params);

        cityRepositoryMoq.setup(x => x.findBySlug(params.slug)).returns(() => {
            throw new Error();
        });
        errorHandlerMoq
            .setup(x => x.logAndCreateInternal(TypeMoq.It.isAny(), TypeMoq.It.isAny()))
            .returns(() => 'error');

        new CityCtrl(errorHandlerMoq.object, auth0ServiceMoq.object, cityRepositoryMoq.object).city(
            reqMoq.object,
            resMoq.object,
            nextMoq.object,
        );

        nextMoq.verify(x => x('error'), TypeMoq.Times.once());
    });
});
