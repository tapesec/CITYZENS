// tslint:disable-next-line:import-name
import {
    HotspotIconType,
    HotspotType,
    HotspotScope,
} from '../../../../src/domain/cityLife/model/hotspot/Hotspot';
import WallHotspotSample from '../../../../src/domain/cityLife/model/sample/WallHotspotSample';
import HotspotFactory from '../../../../src/infrastructure/HotspotFactory';
import CityzenSample from '../../../../src/domain/cityzens/model/CityzenSample';
import cityzenFromJwt from '../../../../src/api/services/cityzen/cityzenFromJwt';
import JwtParser from '../../../../src/api/services/auth/JwtParser';
// tslint:disable-next-line:import-name
import HotspotRepositoryInMemory from '../../../../src/infrastructure/HotspotRepositoryInMemory';
import HotspotCtrl from '../../../../src/api/controllers/HotspotCtrl';
const restifyErrors = require('restify-errors');
import * as TypeMoq from 'typemoq';
import * as rest from 'restify';
import * as sample from './sample';
import ErrorHandler from '../../../../src/api/services/errors/ErrorHandler';
import RootCtrl from '../../../../src/api/controllers/RootCtrl';
import CityzenId from './../../../../src/domain/cityzens/model/CityzenId';
import * as Sinon from 'sinon';
import * as Chai from 'chai';
import { resolve } from 'url';
import Login from '../../../../src/api/services/auth/Login';
import UserInfoAuth0 from '../../../../src/api/services/auth/UserInfoAuth0';
import { FAKE_USER_INFO_AUTH0, FAKE_ADMIN_USER_INFO_AUTH0 } from '../services/samples';
import cityzenFromAuth0 from '../../../../src/api/services/cityzen/cityzenFromAuth0';
import Algolia from '../../../../src/api/services/algolia/Algolia';
import WallHotspot from '../../../../src/domain/cityLife/model/hotspot/WallHotspot';
import HotspotBuilderSample from '../../../../src/domain/cityLife/model/sample/HotspotBuilderSample';
import MediaBuilderSample from '../../../../src/domain/cityLife/model/sample/MediaBuilderSample';
import Author from '../../../../src/domain/cityLife/model/author/Author';
import HotspotBuilder from '../../../../src/domain/cityLife/factories/HotspotBuilder';
import AuthorSample from '../../../../src/domain/cityLife/model/sample/AuthorSample';
import MemberList from '../../../../src/domain/cityLife/model/hotspot/MemberList';
import Auth0Service from '../../../../src/api/services/auth/Auth0Service';
import AlertHotspotSample from '../../../../src/domain/cityLife/model/sample/AlertHotspotSample';
import AlertHotspot from '../../../../src/domain/cityLife/model/hotspot/AlertHotspot';
import VoterList from '../../../../src/domain/cityLife/model/hotspot/VoterList';
import { OK, getStatusText } from 'http-status-codes';
import actAsSpecified from '../../../../src/api/services/hotspot/actAsSpecified';

describe('HotspotCtrl', () => {
    let reqMoq: TypeMoq.IMock<rest.Request>;
    let resMoq: TypeMoq.IMock<rest.Response>;
    let nextMoq: TypeMoq.IMock<rest.Next>;
    let hotspotRepositoryMoq: TypeMoq.IMock<HotspotRepositoryInMemory>;
    let hotspotFactoryMoq: TypeMoq.IMock<HotspotFactory>;
    let errorHandlerMoq: TypeMoq.IMock<ErrorHandler>;
    let auth0ServiceMoq: TypeMoq.IMock<Auth0Service>;
    let hotspotCtrl: HotspotCtrl;
    let algoliaMoq: TypeMoq.IMock<Algolia>;

    before(async () => {
        resMoq = TypeMoq.Mock.ofType<rest.Response>();
        nextMoq = TypeMoq.Mock.ofType<rest.Next>();
        reqMoq = TypeMoq.Mock.ofType<rest.Request>();
        errorHandlerMoq = TypeMoq.Mock.ofType<ErrorHandler>();
        auth0ServiceMoq = TypeMoq.Mock.ofType<Auth0Service>();
        hotspotRepositoryMoq = TypeMoq.Mock.ofType<HotspotRepositoryInMemory>();
        hotspotFactoryMoq = TypeMoq.Mock.ofType<HotspotFactory>();
        algoliaMoq = TypeMoq.Mock.ofType<Algolia>();

        algoliaMoq.setup(x => x.initHotspots()).returns(() => {});

        hotspotCtrl = new HotspotCtrl(
            errorHandlerMoq.object,
            auth0ServiceMoq.object,
            hotspotRepositoryMoq.object,
            hotspotFactoryMoq.object,
            algoliaMoq.object,
        );
    });
    afterEach(() => {
        reqMoq.reset();
        resMoq.reset();
        nextMoq.reset();
        errorHandlerMoq.reset();
        auth0ServiceMoq.reset();
        hotspotRepositoryMoq.reset();
        hotspotFactoryMoq.reset();
        algoliaMoq.reset();
    });

    describe('hotspots', () => {
        let north: number;
        let south: number;
        let west: number;
        let east: number;
        let queryStrings: any;
        let repositoryResult: any;

        before(() => {
            north = 1.111;
            south = -2.434;
            west = 9.23322;
            east = -2.1111;
            repositoryResult = [WallHotspotSample.CHURCH, WallHotspotSample.SCHOOL];
            queryStrings = { north, south, east, west };
        });

        beforeEach(async () => {
            reqMoq.setup(x => x.header('Authorization')).returns(() => 'Bearer my authorisation');
            auth0ServiceMoq
                .setup(x => x.getUserInfo('my authorisation'))
                .returns(() => Promise.resolve(FAKE_USER_INFO_AUTH0));
            await hotspotCtrl.loadAuthenticatedUser(reqMoq.object, resMoq.object, nextMoq.object);
        });

        it(`should respond with 200 and a list of hotspot
        if queryStrings contains valid coords`, () => {
            // Arrange
            reqMoq.setup((x: rest.Request) => x.query).returns(() => queryStrings);

            hotspotRepositoryMoq
                .setup(x => x.findInArea(north, west, south, east))
                .returns(() => repositoryResult);

            // Act
            hotspotCtrl.hotspots(reqMoq.object, resMoq.object, nextMoq.object);
            // Assert
            resMoq.verify(x => x.json(200, repositoryResult), TypeMoq.Times.once());
        });

        it('should returns 400 if invalid format', () => {
            // TODO test assert response isn't 200 but no assert response is 400
            // Arrange
            queryStrings.north = 'bad format';
            reqMoq.setup((x: rest.Request) => x.query).returns(() => queryStrings);
            errorHandlerMoq
                .setup(x => x.logAndCreateBadRequest(TypeMoq.It.isAny(), TypeMoq.It.isAny()))
                .returns(() => 'error');

            // Act
            hotspotCtrl.hotspots(reqMoq.object, resMoq.object, nextMoq.object);

            // Assert
            resMoq.verify(x => x.json(200, []), TypeMoq.Times.never());
            nextMoq.verify(x => x('error'), TypeMoq.Times.once());
        });

        it('Should return 500 if internal error.', () => {
            // Arrange
            queryStrings.north = 1.234;
            const error = new Error('error');

            reqMoq.setup(x => x.query).returns(() => queryStrings);

            hotspotRepositoryMoq
                .setup(x =>
                    x.findInArea(
                        queryStrings.north,
                        queryStrings.west,
                        queryStrings.south,
                        queryStrings.east,
                    ),
                )
                .returns(() => {
                    throw error;
                });
            errorHandlerMoq
                .setup(x => x.logAndCreateInternal(TypeMoq.It.isAny(), error))
                .returns(() => 'error');

            // Act
            hotspotCtrl.hotspots(reqMoq.object, resMoq.object, nextMoq.object);
            // Assert
            nextMoq.verify(x => x('error'), TypeMoq.Times.once());
        });
    });

    describe('postHotspots', () => {
        let jsonBody: any;
        let factoryData: any;

        before(() => {
            jsonBody = {
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
            factoryData = {
                ...jsonBody,
                cityzen: cityzenFromAuth0(FAKE_USER_INFO_AUTH0),
            };
        });
        beforeEach(async () => {
            reqMoq.setup(x => x.header('Authorization')).returns(() => 'Bearer my authorisation');
            auth0ServiceMoq
                .setup(x => x.getUserInfo('my authorisation'))
                .returns(() => Promise.resolve(FAKE_USER_INFO_AUTH0));
            await hotspotCtrl.loadAuthenticatedUser(reqMoq.object, resMoq.object, nextMoq.object);
        });

        it('should create a new hotspot, post it to algolia, and return it with 200 OK', () => {
            const fakeNewHotspot = new HotspotFactory().build(factoryData);
            // Arrange
            algoliaMoq
                .setup(x => x.addHotspot(fakeNewHotspot))
                .returns(() => Promise.resolve<any>({}));

            reqMoq.setup((x: rest.Request) => x.body).returns(() => jsonBody);

            hotspotFactoryMoq.setup(x => x.build(factoryData)).returns(() => fakeNewHotspot);

            // Act
            hotspotCtrl.postHotspots(reqMoq.object, resMoq.object, nextMoq.object);

            // Assert
            hotspotFactoryMoq.verify(x => x.build(jsonBody), TypeMoq.Times.once());
            hotspotRepositoryMoq.verify(x => x.store(fakeNewHotspot), TypeMoq.Times.once());
            resMoq.verify(x => x.json(201, fakeNewHotspot), TypeMoq.Times.once());
            algoliaMoq.verify(x => x.addHotspot(fakeNewHotspot), TypeMoq.Times.once());
        });
    });

    describe('getHotspots', () => {
        let id: string;
        let params: any;
        let hotspot: WallHotspot;

        const errorNotfound: any = { notfound: true };
        const errorUnauthorized: any = { unauthorized: true };

        beforeEach(() => {
            id = 'idid';
            params = {
                id,
            };
            hotspot = new WallHotspot(
                HotspotBuilderSample.CHURCH_HOTSPOT_BUILDER,
                MediaBuilderSample.CHURCH_MEDIA_BUILDER,
            );

            reqMoq.setup(x => x.path()).returns(() => 'path');

            reqMoq.setup(x => x.params).returns(() => params);

            errorHandlerMoq
                .setup(x => x.logAndCreateNotFound(`GET path`, HotspotCtrl.HOTSPOT_NOT_FOUND))
                .returns(() => errorNotfound);

            errorHandlerMoq
                .setup(x => x.logAndCreateUnautorized(`GET path`, HotspotCtrl.HOTSPOT_PRIVATE))
                .returns(() => errorUnauthorized);
        });

        beforeEach(async () => {
            reqMoq.setup(x => x.header('Authorization')).returns(() => 'Bearer my authorisation');
            auth0ServiceMoq
                .setup(x => x.getUserInfo('my authorisation'))
                .returns(() => Promise.resolve(FAKE_USER_INFO_AUTH0));
            await hotspotCtrl.loadAuthenticatedUser(reqMoq.object, resMoq.object, nextMoq.object);
        });

        it('Should return 200 on valid call', () => {
            hotspotRepositoryMoq.setup(x => x.isSet(id)).returns(() => true);

            hotspotRepositoryMoq.setup(x => x.findById(id)).returns(() => hotspot);

            hotspotCtrl.getHotspot(reqMoq.object, resMoq.object, nextMoq.object);

            resMoq.verify(x => x.json(200, hotspot), TypeMoq.Times.once());
        });

        it('Should return 404 on unfondable call', () => {
            hotspotRepositoryMoq.setup(x => x.isSet(id)).returns(() => false);

            hotspotRepositoryMoq.setup(x => x.findById(id)).returns(() => hotspot);

            hotspotCtrl.getHotspot(reqMoq.object, resMoq.object, nextMoq.object);

            nextMoq.verify(x => x(errorNotfound), TypeMoq.Times.once());
        });

        it('Should return 401 on private call and wrong id', () => {
            hotspot.changeScope(HotspotScope.Private);

            hotspotRepositoryMoq.setup(x => x.isSet(id)).returns(() => true);

            hotspotRepositoryMoq.setup(x => x.findById(id)).returns(() => hotspot);

            hotspotCtrl.getHotspot(reqMoq.object, resMoq.object, nextMoq.object);

            nextMoq.verify(x => x(errorUnauthorized), TypeMoq.Times.once());
        });

        it('Should return 200 on private call with right id', () => {
            const hotspotMoq = TypeMoq.Mock.ofType<WallHotspot>();

            hotspotMoq.setup(x => x.scope).returns(() => HotspotScope.Private);

            hotspotMoq.setup(x => x.members).returns(() => new MemberList());

            hotspotMoq
                .setup(x => x.author)
                .returns(() => new Author('', cityzenFromAuth0(FAKE_USER_INFO_AUTH0).id));

            hotspotRepositoryMoq.setup(x => x.isSet(id)).returns(() => true);

            hotspotRepositoryMoq.setup(x => x.findById(id)).returns(() => hotspotMoq.object);

            hotspotCtrl.getHotspot(reqMoq.object, resMoq.object, nextMoq.object);

            resMoq.verify(x => x.json(200, hotspotMoq.object), TypeMoq.Times.once());
        });
    });

    describe('addMember', () => {
        let jsonBody: any;
        let jsonParams: any;
        const hotspot = TypeMoq.Mock.ofType<WallHotspot>();

        before(() => {
            jsonBody = {
                memberId: 'idMacIdFace',
            };
            jsonParams = {
                hotspotId: 'idid',
            };
        });

        beforeEach(async () => {
            reqMoq.setup(x => x.header('Authorization')).returns(() => 'Bearer my authorisation');
            auth0ServiceMoq
                .setup(x => x.getUserInfo('my authorisation'))
                .returns(() => Promise.resolve(FAKE_USER_INFO_AUTH0));
            await hotspotCtrl.loadAuthenticatedUser(reqMoq.object, resMoq.object, nextMoq.object);
        });

        afterEach(() => {
            reqMoq.reset();
            resMoq.reset();
            nextMoq.reset();
            hotspotRepositoryMoq.reset();
            errorHandlerMoq.reset();
            algoliaMoq.reset();
        });

        it('should add new member to hotspot on validcall', () => {
            hotspot
                .setup(x => x.author)
                .returns(() => new Author('', cityzenFromAuth0(FAKE_USER_INFO_AUTH0).id));

            reqMoq.setup((x: rest.Request) => x.body).returns(() => jsonBody);

            reqMoq.setup((x: rest.Request) => x.params).returns(() => jsonParams);

            hotspotRepositoryMoq.setup(x => x.isSet(jsonParams.hotspotId)).returns(() => true);

            hotspotRepositoryMoq
                .setup(x => x.findById(jsonParams.hotspotId))
                .returns(() => hotspot.object);

            // Act
            hotspotCtrl.addMember(reqMoq.object, resMoq.object, nextMoq.object);

            // Assert

            hotspotRepositoryMoq.verify(
                x => x.findById(jsonParams.hotspotId),
                TypeMoq.Times.once(),
            );

            hotspotRepositoryMoq.verify(x => x.update(hotspot.object), TypeMoq.Times.once());

            hotspot.verify(
                x => x.addMember(new CityzenId(jsonBody.memberId)),
                TypeMoq.Times.once(),
            );
            resMoq.verify(x => x.json(200, hotspot.object), TypeMoq.Times.once());
        });

        it('Should return internal error.', () => {
            const error = new Error('message');

            hotspot
                .setup(x => x.author)
                .returns(() => new Author('', cityzenFromAuth0(FAKE_USER_INFO_AUTH0).id));

            reqMoq.setup((x: rest.Request) => x.body).returns(() => jsonBody);

            reqMoq.setup((x: rest.Request) => x.params).returns(() => jsonParams);

            hotspotRepositoryMoq.setup(x => x.isSet(jsonParams.hotspotId)).returns(() => true);
            hotspotRepositoryMoq.setup(x => x.findById(jsonParams.hotspotId)).returns(() => {
                throw error;
            });

            errorHandlerMoq
                .setup(x => x.logAndCreateInternal(TypeMoq.It.isAny(), error))
                .returns(() => 'error');

            hotspotCtrl.addMember(reqMoq.object, resMoq.object, nextMoq.object);

            nextMoq.verify(x => x('error'), TypeMoq.Times.once());
        });
    });

    describe('PostPertinence', () => {
        let body: any;
        let params: any;

        before(async () => {
            body = {
                agree: true,
            };

            params = {
                hotspotId: 'hotspotId',
            };
        });

        beforeEach(async () => {
            reqMoq.setup(x => x.header('Authorization')).returns(() => 'Bearer my authorisation');
            auth0ServiceMoq
                .setup(x => x.getUserInfo('my authorisation'))
                .returns(() => Promise.resolve(FAKE_ADMIN_USER_INFO_AUTH0));
            await hotspotCtrl.loadAuthenticatedUser(reqMoq.object, resMoq.object, nextMoq.object);
        });

        afterEach(() => {
            reqMoq.reset();
            resMoq.reset();
            nextMoq.reset();
            hotspotRepositoryMoq.reset();
            errorHandlerMoq.reset();
        });

        it('Should return not found.', () => {
            reqMoq.setup(x => x.body).returns(() => body);
            reqMoq.setup(x => x.params).returns(() => params);

            hotspotRepositoryMoq.setup(x => x.isSet(params.hotspotId)).returns(() => false);
            errorHandlerMoq
                .setup(x => x.logAndCreateNotFound(TypeMoq.It.isAny(), TypeMoq.It.isAny()))
                .returns(() => 'error');

            hotspotCtrl.postPertinence(reqMoq.object, resMoq.object, nextMoq.object);

            nextMoq.verify(x => x('error'), TypeMoq.Times.once());
        });

        it('Should return bad request on hotspot different than Alert.', () => {
            const hotspot = WallHotspotSample.SCHOOL;

            reqMoq.setup(x => x.body).returns(() => body);
            reqMoq.setup(x => x.params).returns(() => params);

            hotspotRepositoryMoq.setup(x => x.isSet(params.hotspotId)).returns(() => true);
            hotspotRepositoryMoq.setup(x => x.findById(params.hotspotId)).returns(() => hotspot);

            errorHandlerMoq
                .setup(x => x.logAndCreateBadRequest(TypeMoq.It.isAny(), TypeMoq.It.isAny()))
                .returns(() => 'error');

            hotspotCtrl.postPertinence(reqMoq.object, resMoq.object, nextMoq.object);

            nextMoq.verify(x => x('error'), TypeMoq.Times.once());
        });

        it('Should return internal error.', () => {
            const hotspot = WallHotspotSample.SCHOOL;
            const error = new Error('message');

            reqMoq.setup(x => x.body).returns(() => body);
            reqMoq.setup(x => x.params).returns(() => params);

            hotspotRepositoryMoq.setup(x => x.isSet(params.hotspotId)).returns(() => true);
            hotspotRepositoryMoq.setup(x => x.findById(params.hotspotId)).returns(() => {
                throw error;
            });

            errorHandlerMoq
                .setup(x => x.logAndCreateInternal(TypeMoq.It.isAny(), error))
                .returns(() => 'error');

            hotspotCtrl.postPertinence(reqMoq.object, resMoq.object, nextMoq.object);

            nextMoq.verify(x => x('error'), TypeMoq.Times.once());
        });

        it('Should agree on the pertinence of an hotspot', () => {
            const hotspot = new AlertHotspot(
                HotspotBuilderSample.ACCIDENT_HOTSPOT_BUILDER,
                AlertHotspotSample.ACCIDENT.message,
                AlertHotspotSample.ACCIDENT.pertinence,
                new VoterList(),
            );

            reqMoq.setup(x => x.body).returns(() => body);
            reqMoq.setup(x => x.params).returns(() => params);

            hotspotRepositoryMoq.setup(x => x.isSet(params.hotspotId)).returns(() => true);
            hotspotRepositoryMoq.setup(x => x.findById(params.hotspotId)).returns(() => hotspot);

            hotspotCtrl.postPertinence(reqMoq.object, resMoq.object, nextMoq.object);

            resMoq.verify(x => x.json(OK, TypeMoq.It.isAny()), TypeMoq.Times.once());
            Chai.expect(hotspot.pertinence.nAgree).to.be.greaterThan(0);
        });

        it('Should return bad request already voted', () => {
            const hotspot = new AlertHotspot(
                HotspotBuilderSample.ACCIDENT_HOTSPOT_BUILDER,
                AlertHotspotSample.ACCIDENT.message,
                AlertHotspotSample.ACCIDENT.pertinence,
                new VoterList(),
            );
            hotspot.addVoter(cityzenFromAuth0(FAKE_ADMIN_USER_INFO_AUTH0).id, true);

            reqMoq.setup(x => x.body).returns(() => body);
            reqMoq.setup(x => x.params).returns(() => params);

            hotspotRepositoryMoq.setup(x => x.isSet(params.hotspotId)).returns(() => true);
            hotspotRepositoryMoq.setup(x => x.findById(params.hotspotId)).returns(() => hotspot);

            errorHandlerMoq
                .setup(x =>
                    x.logAndCreateBadRequest(
                        TypeMoq.It.isAny(),
                        HotspotCtrl.PERTINENCE_DOUBLE_VOTE,
                    ),
                )
                .returns(() => 'error');

            hotspotCtrl.postPertinence(reqMoq.object, resMoq.object, nextMoq.object);

            nextMoq.verify(x => x('error'), TypeMoq.Times.once());
        });

        it('Should disagree on the pertinence of an hotspot', () => {
            body = { agree: false };
            const hotspot = new AlertHotspot(
                HotspotBuilderSample.ACCIDENT_HOTSPOT_BUILDER,
                AlertHotspotSample.ACCIDENT.message,
                AlertHotspotSample.ACCIDENT.pertinence,
                new VoterList(),
            );

            reqMoq.setup(x => x.body).returns(() => body);
            reqMoq.setup(x => x.params).returns(() => params);

            hotspotRepositoryMoq.setup(x => x.isSet(params.hotspotId)).returns(() => true);
            hotspotRepositoryMoq.setup(x => x.findById(params.hotspotId)).returns(() => hotspot);

            hotspotCtrl.postPertinence(reqMoq.object, resMoq.object, nextMoq.object);

            resMoq.verify(x => x.json(OK, TypeMoq.It.isAny()), TypeMoq.Times.once());
            Chai.expect(hotspot.pertinence.nDisagree).to.be.greaterThan(0);
        });
    });

    describe('patchHotspot', () => {
        beforeEach(async () => {
            reqMoq.setup(x => x.header('Authorization')).returns(() => 'Bearer my authorisation');
            auth0ServiceMoq
                .setup(x => x.getUserInfo('my authorisation'))
                .returns(() => Promise.resolve(FAKE_USER_INFO_AUTH0));
            await hotspotCtrl.loadAuthenticatedUser(reqMoq.object, resMoq.object, nextMoq.object);
        });

        afterEach(() => {
            reqMoq.reset();
            resMoq.reset();
            nextMoq.reset();
            hotspotRepositoryMoq.reset();
            errorHandlerMoq.reset();
            algoliaMoq.reset();
        });

        it('Should not validate query.', () => {
            const body = {
                garbage: true,
                isInvalid: 'totallllly',
            };
            reqMoq.setup(x => x.body).returns(() => body);
            errorHandlerMoq
                .setup(x => x.logAndCreateBadRequest(TypeMoq.It.isAny(), TypeMoq.It.isAny()))
                .returns(() => 'error');

            hotspotCtrl.patchHotspots(reqMoq.object, resMoq.object, nextMoq.object);

            reqMoq.verify(x => x.body, TypeMoq.Times.once());
            nextMoq.verify(x => x('error'), TypeMoq.Times.once());
            hotspotRepositoryMoq.verify(x => x.update(TypeMoq.It.isAny()), TypeMoq.Times.never());
        });

        it('Should return not found.', () => {
            const body = {
                title: 'new title',
            };
            const params = {
                hotspotId: 'idid',
            };

            reqMoq.setup(x => x.body).returns(() => body);
            reqMoq.setup(x => x.params).returns(() => params);

            hotspotRepositoryMoq.setup(x => x.isSet(params.hotspotId)).returns(() => false);

            errorHandlerMoq
                .setup(x => x.logAndCreateNotFound(TypeMoq.It.isAny(), TypeMoq.It.isAny()))
                .returns(() => 'error');

            hotspotCtrl.patchHotspots(reqMoq.object, resMoq.object, nextMoq.object);

            reqMoq.verify(x => x.body, TypeMoq.Times.once());
            reqMoq.verify(x => x.params, TypeMoq.Times.once());
            nextMoq.verify(x => x('error'), TypeMoq.Times.once());
            hotspotRepositoryMoq.verify(x => x.update(TypeMoq.It.isAny()), TypeMoq.Times.never());
        });

        it('Should return unauthorized.', () => {
            const body = {
                title: 'new title',
            };
            const params = {
                hotspotId: 'idid',
            };
            const hotspot = WallHotspotSample.SCHOOL;

            reqMoq.setup(x => x.body).returns(() => body);
            reqMoq.setup(x => x.params).returns(() => params);

            hotspotRepositoryMoq.setup(x => x.isSet(params.hotspotId)).returns(() => true);
            hotspotRepositoryMoq.setup(x => x.findById(params.hotspotId)).returns(() => hotspot);

            errorHandlerMoq
                .setup(x => x.logAndCreateUnautorized(TypeMoq.It.isAny(), TypeMoq.It.isAny()))
                .returns(() => 'error');

            hotspotCtrl.patchHotspots(reqMoq.object, resMoq.object, nextMoq.object);

            nextMoq.verify(x => x('error'), TypeMoq.Times.once());
            hotspotRepositoryMoq.verify(x => x.update(TypeMoq.It.isAny()), TypeMoq.Times.never());
        });

        it('Should return succesfully.', async () => {
            reqMoq.setup(x => x.header('Authorization')).returns(() => 'Bearer my authorisation');
            auth0ServiceMoq
                .setup(x => x.getUserInfo('my authorisation'))
                .returns(() => Promise.resolve(FAKE_ADMIN_USER_INFO_AUTH0));
            await hotspotCtrl.loadAuthenticatedUser(reqMoq.object, resMoq.object, nextMoq.object);

            const body = {
                title: 'new title',
            };
            const params = {
                hotspotId: 'idid',
            };
            const hotspot = new WallHotspot(
                HotspotBuilderSample.SCHOOL_HOTSPOT_BUILDER,
                MediaBuilderSample.SCHOOL_MEDIA_BUILDER,
            );
            const updatedHotspot = actAsSpecified(
                new WallHotspot(
                    HotspotBuilderSample.SCHOOL_HOTSPOT_BUILDER,
                    MediaBuilderSample.SCHOOL_MEDIA_BUILDER,
                ),
                body,
            );

            reqMoq.setup(x => x.body).returns(() => body);
            reqMoq.setup(x => x.params).returns(() => params);

            hotspotRepositoryMoq.setup(x => x.isSet(params.hotspotId)).returns(() => true);
            hotspotRepositoryMoq.setup(x => x.findById(params.hotspotId)).returns(() => hotspot);

            algoliaMoq
                .setup(x => x.addHotspot(updatedHotspot))
                .returns(() => Promise.resolve<any>({}));

            hotspotCtrl.patchHotspots(reqMoq.object, resMoq.object, nextMoq.object);

            resMoq.verify(x => x.json(OK, updatedHotspot), TypeMoq.Times.once());
            hotspotRepositoryMoq.verify(x => x.update(updatedHotspot), TypeMoq.Times.once());
        });

        it('Should return internal error.', () => {
            const body = {
                title: 'new title',
            };
            const params = {
                hotspotId: 'idid',
            };
            const hotspot = new WallHotspot(
                HotspotBuilderSample.SCHOOL_HOTSPOT_BUILDER,
                MediaBuilderSample.SCHOOL_MEDIA_BUILDER,
            );
            const error = new Error('message');

            reqMoq.setup(x => x.body).returns(() => body);
            reqMoq.setup(x => x.params).returns(() => params);

            hotspotRepositoryMoq.setup(x => x.isSet(params.hotspotId)).returns(() => true);
            hotspotRepositoryMoq.setup(x => x.findById(params.hotspotId)).returns(() => {
                throw error;
            });

            errorHandlerMoq
                .setup(x => x.logAndCreateInternal(TypeMoq.It.isAny(), error))
                .returns(() => 'error');

            hotspotCtrl.patchHotspots(reqMoq.object, resMoq.object, nextMoq.object);

            nextMoq.verify(x => x('error'), TypeMoq.Times.once());
            hotspotRepositoryMoq.verify(x => x.update(TypeMoq.It.isAny()), TypeMoq.Times.never());
        });
    });

    describe('removeHotspot', () => {
        beforeEach(async () => {
            reqMoq.setup(x => x.header('Authorization')).returns(() => 'Bearer my authorisation');
            auth0ServiceMoq
                .setup(x => x.getUserInfo('my authorisation'))
                .returns(() => Promise.resolve(FAKE_ADMIN_USER_INFO_AUTH0));
            await hotspotCtrl.loadAuthenticatedUser(reqMoq.object, resMoq.object, nextMoq.object);
        });

        afterEach(() => {
            reqMoq.reset();
            resMoq.reset();
            nextMoq.reset();
            hotspotRepositoryMoq.reset();
            errorHandlerMoq.reset();
        });

        it('Should remove.', () => {
            const params = {
                hotspotId: 'id',
            };
            const hotspot = WallHotspotSample.SCHOOL;

            reqMoq.setup(x => x.params).returns(() => params);

            hotspotRepositoryMoq.setup(x => x.isSet(params.hotspotId)).returns(() => true);
            hotspotRepositoryMoq.setup(x => x.findById(params.hotspotId)).returns(() => hotspot);

            hotspotCtrl.removeHotspot(reqMoq.object, resMoq.object, nextMoq.object);

            resMoq.verify(x => x.json(OK, getStatusText(OK)), TypeMoq.Times.once());
            hotspotRepositoryMoq.verify(x => x.remove(params.hotspotId), TypeMoq.Times.once());
        });

        it('Should return not found.', () => {
            const params = {
                hotspotId: 'id',
            };

            reqMoq.setup(x => x.params).returns(() => params);

            hotspotRepositoryMoq.setup(x => x.isSet(params.hotspotId)).returns(() => false);
            errorHandlerMoq
                .setup(x => x.logAndCreateNotFound(HotspotCtrl.HOTSPOT_NOT_FOUND))
                .returns(() => 'error');

            hotspotCtrl.removeHotspot(reqMoq.object, resMoq.object, nextMoq.object);

            nextMoq.verify(x => x('error'), TypeMoq.Times.once());
            hotspotRepositoryMoq.verify(x => x.remove(params.hotspotId), TypeMoq.Times.never());
        });

        it('Should return unauthorized.', async () => {
            reqMoq.setup(x => x.header('Authorization')).returns(() => 'Bearer my authorisation');
            auth0ServiceMoq
                .setup(x => x.getUserInfo('my authorisation'))
                .returns(() => Promise.resolve(FAKE_USER_INFO_AUTH0));
            await hotspotCtrl.loadAuthenticatedUser(reqMoq.object, resMoq.object, nextMoq.object);

            const params = {
                hotspotId: 'id',
            };
            const hotspot = WallHotspotSample.SCHOOL;

            reqMoq.setup(x => x.params).returns(() => params);

            hotspotRepositoryMoq.setup(x => x.isSet(params.hotspotId)).returns(() => true);
            hotspotRepositoryMoq.setup(x => x.findById(params.hotspotId)).returns(() => hotspot);
            errorHandlerMoq
                .setup(x => x.logAndCreateUnautorized(TypeMoq.It.isAny(), TypeMoq.It.isAny()))
                .returns(() => 'error');

            hotspotCtrl.removeHotspot(reqMoq.object, resMoq.object, nextMoq.object);

            nextMoq.verify(x => x('error'), TypeMoq.Times.once());
            hotspotRepositoryMoq.verify(x => x.remove(params.hotspotId), TypeMoq.Times.never());
        });

        it('Should return internal error.', async () => {
            const params = {
                hotspotId: 'id',
            };
            const hotspot = WallHotspotSample.SCHOOL;
            const error = new Error('message');

            reqMoq.setup(x => x.params).returns(() => params);

            hotspotRepositoryMoq.setup(x => x.isSet(params.hotspotId)).returns(() => true);
            hotspotRepositoryMoq.setup(x => x.findById(params.hotspotId)).returns(() => {
                throw error;
            });
            errorHandlerMoq
                .setup(x => x.logAndCreateInternal(TypeMoq.It.isAny(), error))
                .returns(() => 'error');

            hotspotCtrl.removeHotspot(reqMoq.object, resMoq.object, nextMoq.object);

            nextMoq.verify(x => x('error'), TypeMoq.Times.once());
            hotspotRepositoryMoq.verify(x => x.remove(params.hotspotId), TypeMoq.Times.never());
        });
    });
});
