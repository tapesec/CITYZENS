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

import * as Sinon from 'sinon';
import * as Chai from 'chai';
import { resolve } from 'url';
import Login from '../../../../src/api/services/auth/Login';
import UserInfoAuth0 from '../../../../src/api/services/auth/UserInfoAuth0';
import { FAKE_USER_INFO_AUTH0 } from '../services/samples';
import cityzenFromAuth0 from '../../../../src/api/services/cityzen/cityzenFromAuth0';
import Algolia from '../../../../src/api/services/algolia/Algolia';
import WallHotspot from '../../../../src/domain/cityLife/model/hotspot/WallHotspot';
import
    HotspotBuilderSample from '../../../../src/domain/cityLife/model/sample/HotspotBuilderSample';
import MediaBuilderSample from '../../../../src/domain/cityLife/model/sample/MediaBuilderSample';
import Author from '../../../../src/domain/cityLife/model/author/Author';
import HotspotBuilder from '../../../../src/domain/cityLife/factories/HotspotBuilder';
import AuthorSample from '../../../../src/domain/cityLife/model/sample/AuthorSample';

describe('HotspotCtrl', () => {

    let reqMoq : TypeMoq.IMock<rest.Request>;
    let resMoq : TypeMoq.IMock<rest.Response>;
    let nextMoq : TypeMoq.IMock<rest.Next>;
    let hotspotRepositoryMoq : TypeMoq.IMock<HotspotRepositoryInMemory>;
    let hotspotFactoryMoq : TypeMoq.IMock<HotspotFactory>;
    let errorHandlerMoq : TypeMoq.IMock<ErrorHandler>;
    let loginServiceMoq : TypeMoq.IMock<Login>;
    let hotspotCtrl : HotspotCtrl;
    let algoliaMoq: TypeMoq.IMock<Algolia>;

    before(async () => {
        resMoq = TypeMoq.Mock.ofType<rest.Response>();
        nextMoq = TypeMoq.Mock.ofType<rest.Next>();
        reqMoq = TypeMoq.Mock.ofType<rest.Request>();
        errorHandlerMoq = TypeMoq.Mock.ofType<ErrorHandler>();
        loginServiceMoq = TypeMoq.Mock.ofType<Login>();
        hotspotRepositoryMoq = TypeMoq.Mock.ofType<HotspotRepositoryInMemory>();
        hotspotFactoryMoq = TypeMoq.Mock.ofType<HotspotFactory>();
        algoliaMoq = TypeMoq.Mock.ofType<Algolia>();

        algoliaMoq
            .setup(x => x.initHotspots())
            .returns(() => {});

        reqMoq
            .setup(x => x.header('Authorization'))
            .returns(() => 'Bearer my authorisation');

        loginServiceMoq
            .setup(x => x.auth0UserInfo('my authorisation'))
            .returns(() => Promise.resolve(FAKE_USER_INFO_AUTH0));

        hotspotCtrl = new HotspotCtrl(
            errorHandlerMoq.object, loginServiceMoq.object, hotspotRepositoryMoq.object,
            hotspotFactoryMoq.object, algoliaMoq.object,
        );
        // appel du middleware de control d'acces de l'utilsateur
        await hotspotCtrl.loadAuthenticatedUser(reqMoq.object, resMoq.object, nextMoq.object);
    });

    describe('hotspots', () => {

        let north : number;
        let south : number;
        let west : number;
        let east : number;
        let queryStrings : any;
        let repositoryResult : any;

        before(() => {
            north = 1.111;
            south = -2.434;
            west = 9.23322;
            east = -2.1111;
            repositoryResult = [WallHotspotSample.CHURCH, WallHotspotSample.SCHOOL];
            queryStrings = { north, south, east, west };
        });

        it(
        `should respond with 200 and a list of hotspot
        if queryStrings contains valid coords`,
        () => {
            // Arrange
            reqMoq
            .setup((x : rest.Request) => x.query)
            .returns(() => queryStrings);

            hotspotRepositoryMoq
            .setup(x => x.findInArea(north, west, south, east))
            .returns(() => repositoryResult);

             // Act
            hotspotCtrl.hotspots(reqMoq.object, resMoq.object, nextMoq.object);
            // Assert
            resMoq
            .verify(
                x => x.json(200, repositoryResult),
                TypeMoq.Times.once());
        });

        it('should returns 400 if invalid format', () => {
            // TODO test assert response isn't 200 but no assert response is 400
            // Arrange
            queryStrings.north = 'bad format';
            reqMoq
            .setup((x : rest.Request) => x.query)
            .returns(() => queryStrings);

            // Act
            hotspotCtrl.hotspots(reqMoq.object, resMoq.object, nextMoq.object);

            // Assert
            resMoq
            .verify(
                x => x.json(200, []),
                TypeMoq.Times.never());
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

        it ('should create a new hotspot, post it to algolia, and return it with 200 OK', () => {
            const fakeNewHotspot = new HotspotFactory().build(factoryData);

            // Arrange
            algoliaMoq
                .setup(x => x.addHotspot(fakeNewHotspot, hotspotRepositoryMoq.object))
                .returns(() => Promise.resolve<any>({}));

            reqMoq
            .setup((x : rest.Request) => x.body)
            .returns(() => jsonBody);


            hotspotFactoryMoq
            .setup(x => x.build(factoryData))
            .returns(() => fakeNewHotspot);

            // Act
            hotspotCtrl.postHotspots(reqMoq.object, resMoq.object, nextMoq.object);

            // Assert
            hotspotFactoryMoq.verify(x => x.build(jsonBody), TypeMoq.Times.once());
            hotspotRepositoryMoq.verify(x => x.store(fakeNewHotspot), TypeMoq.Times.once());
            resMoq.verify(x => x.json(201, fakeNewHotspot), TypeMoq.Times.once());
            algoliaMoq.verify(
                x => x.addHotspot(fakeNewHotspot, hotspotRepositoryMoq.object),
                TypeMoq.Times.once(),
            );
        });
    });

    describe('getHotspots', () => {
        let id: string;
        let params: any;
        let hotspot: WallHotspot;

        const errorNotfound: any = { notfound: true };
        const errorUnauthorized: any = { unauthorized: true };

        before(() => {
            id = 'idid';
            params = {
                id,
            };
            hotspot = new WallHotspot(
                HotspotBuilderSample.CHURCH_HOTSPOT_BUILDER,
                MediaBuilderSample.CHURCH_MEDIA_BUILDER,
            );

            reqMoq
                .setup(x => x.path())
                .returns(() => 'path');

            reqMoq
                .setup(x => x.params)
                .returns(() => { return { id }; });

            errorHandlerMoq
                .setup(x => x.logAndCreateNotFound(`GET path`, HotspotCtrl.HOTSPOT_NOT_FOUND))
                .returns(() => errorNotfound);

            errorHandlerMoq
                .setup(x => x.logAndCreateUnautorized(`GET path`, HotspotCtrl.HOTSPOT_PRIVATE))
                .returns(() => errorUnauthorized);
        });

        it('Should return 200 on valid call', () => {
            hotspotRepositoryMoq
                .setup(x => x.isSet(id))
                .returns(() => true);

            hotspotRepositoryMoq
                .setup(x => x.findById(id))
                .returns(() => hotspot);

            hotspotCtrl.getHotspot(reqMoq.object, resMoq.object, nextMoq.object);

            resMoq.verify(x => x.json(200, hotspot), TypeMoq.Times.once());
        });

        it('Should return 404 on unfondable call', () => {
            hotspotRepositoryMoq
                .setup(x => x.isSet(id))
                .returns(() => false);

            hotspotRepositoryMoq
                .setup(x => x.findById(id))
                .returns(() => hotspot);

            hotspotCtrl.getHotspot(reqMoq.object, resMoq.object, nextMoq.object);

            nextMoq.verify(
                x => x(errorNotfound),
                TypeMoq.Times.once(),
            );
        });


        it('Should return 401 on private call and wrong id', () => {
            hotspot.changeScope(HotspotScope.Private);

            hotspotRepositoryMoq
                .setup(x => x.isSet(id))
                .returns(() => true);

            hotspotRepositoryMoq
                .setup(x => x.findById(id))
                .returns(() => hotspot);

            hotspotCtrl.getHotspot(reqMoq.object, resMoq.object, nextMoq.object);

            nextMoq.verify(
                x => x(errorUnauthorized),
                TypeMoq.Times.once(),
            );
        });


        it('Should return 200 on private call with right id', () => {
            const HB = ({
                ...HotspotBuilderSample.CHURCH_HOTSPOT_BUILDER,
                author: {
                    ...AuthorSample.MARTIN,
                    id: cityzenFromAuth0(FAKE_USER_INFO_AUTH0).id,
                },
            } as HotspotBuilder);

            hotspot = new WallHotspot(
                HB,
                MediaBuilderSample.CHURCH_MEDIA_BUILDER,
            );

            hotspot.changeScope(HotspotScope.Private);
            const newHotspot = {
                ...hotspot,
            };

            hotspotRepositoryMoq
                .setup(x => x.isSet(id))
                .returns(() => true);

            hotspotRepositoryMoq
                .setup(x => x.findById(id))
                .returns(() => (newHotspot as WallHotspot));

            hotspotCtrl.getHotspot(reqMoq.object, resMoq.object, nextMoq.object);

            resMoq.verify(x => x.json(200, hotspot), TypeMoq.Times.once());
        });
    });
});
