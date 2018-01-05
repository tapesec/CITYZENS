// tslint:disable-next-line:import-name
import {
    HotspotIconType,
    HotspotType,
} from '../../../../src/domain/cityLife/model/hotspot/Hotspot';
import WallHotspotSample from '../../../../src/domain/cityLife/model/sample/WallHotspotSample';
import HotspotFactory from '../../../../src/infrastructure/HotspotFactory';
import CityzenSample from '../../../../src/domain/cityzens/model/CityzenSample';
import cityzenFromJwt from '../../../../src/api/services/cityzen/cityzenFromJwt';
import JwtParser from '../../../../src/api/services/auth/JwtParser';
// tslint:disable-next-line:import-name
import { HotspotRepositoryInMemory }
from '../../../../src/infrastructure/HotspotRepositoryInMemory';
import HotspotCtrl from '../../../../src/api/controllers/HotspotCtrl';
const restifyErrors = require('restify-errors');
import * as TypeMoq from 'typemoq';
import * as rest from 'restify';
import * as sample from './sample';
import ErrorHandler from '../../../../src/api/services/errors/ErrorHandler';
import RootCtrl from '../../../../src/api/controllers/RootCtrl';

import * as Sinon from 'sinon';
import { resolve } from 'url';
import Login from '../../../../src/api/services/auth/Login';
import UserInfoAuth0 from '../../../../src/api/services/auth/UserInfoAuth0';
import { FAKE_USER_INFO_AUTH0 } from '../services/samples';
import cityzenFromAuth0 from '../../../../src/api/services/cityzen/cityzenFromAuth0';

describe('HotspotCtrl', () => {

    let reqMoq : TypeMoq.IMock<rest.Request>;
    let resMoq : TypeMoq.IMock<rest.Response>;
    let nextMoq : TypeMoq.IMock<rest.Next>;
    let hotspotRepositoryMoq : TypeMoq.IMock<HotspotRepositoryInMemory>;
    let hotspotFactoryMoq : TypeMoq.IMock<HotspotFactory>;
    let errorHandlerMoq : TypeMoq.IMock<ErrorHandler>;
    let loginServiceMoq : TypeMoq.IMock<Login>;
    let hotspotCtrl : HotspotCtrl;

    before(async () => {
        resMoq = TypeMoq.Mock.ofType<rest.Response>();
        nextMoq = TypeMoq.Mock.ofType<rest.Next>();
        reqMoq = TypeMoq.Mock.ofType<rest.Request>();
        errorHandlerMoq = TypeMoq.Mock.ofType<ErrorHandler>();
        loginServiceMoq = TypeMoq.Mock.ofType<Login>();
        hotspotRepositoryMoq = TypeMoq.Mock.ofType<HotspotRepositoryInMemory>();
        hotspotFactoryMoq = TypeMoq.Mock.ofType<HotspotFactory>();

        reqMoq
            .setup(x => x.header('Authorization'))
            .returns(() => 'Bearer my authorisation');

        loginServiceMoq
            .setup(x => x.auth0UserInfo('my authorisation'))
            .returns(() => Promise.resolve(FAKE_USER_INFO_AUTH0));

        hotspotCtrl = new HotspotCtrl(
            errorHandlerMoq.object, loginServiceMoq.object, hotspotRepositoryMoq.object,
            hotspotFactoryMoq.object,
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

        it ('should create a new hotspot and return it with 200 OK', () => {
            // Arrange
            reqMoq
            .setup((x : rest.Request) => x.body)
            .returns(() => jsonBody);

            const fakeNewHotspot = new HotspotFactory().build(factoryData);

            hotspotFactoryMoq
            .setup(x => x.build(factoryData))
            .returns(() => fakeNewHotspot);

            // Act
            hotspotCtrl.postHotspots(reqMoq.object, resMoq.object, nextMoq.object);

            // Assert
            hotspotFactoryMoq.verify(x => x.build(jsonBody), TypeMoq.Times.once());
            hotspotRepositoryMoq.verify(x => x.store(fakeNewHotspot), TypeMoq.Times.once());
            resMoq.verify(x => x.json(201, fakeNewHotspot), TypeMoq.Times.once());
        });
    });
});
