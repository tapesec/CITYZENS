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
import * as querystring from 'querystring';
// tslint:disable-next-line:import-name
import { HotspotRepositoryInMemory }
from '../../../../src/infrastructure/HotspotRepositoryInMemory';
import HotspotCtrl from '../../../../src/api/controllers/HotspotCtrl';
const restifyErrors = require('restify-errors');
import * as TypeMoq from 'typemoq';
import * as rest from 'restify';
import * as sample from './sample';

describe('HotspotCtrl', () => {

    let reqMoq : TypeMoq.IMock<rest.Request>;
    let resMoq : TypeMoq.IMock<rest.Response>;
    let nextMoq : TypeMoq.IMock<rest.Next>;
    let hotspotRepositoryMoq : TypeMoq.IMock<HotspotRepositoryInMemory>;
    let hotspotFactoryMoq : TypeMoq.IMock<HotspotFactory>;
    let jwtParserMoq : TypeMoq.IMock<JwtParser>;
    let hotspotCtrl : HotspotCtrl;

    before(async () => {
        resMoq = TypeMoq.Mock.ofType<rest.Response>();
        nextMoq = TypeMoq.Mock.ofType<rest.Next>();
        // mock la lecture du header http contenant le jwt
        // simule la validation du jwt token
        reqMoq = TypeMoq.Mock.ofType<rest.Request>();
        jwtParserMoq = TypeMoq.Mock.ofType<JwtParser>();
        sample.setupReqAuthorizationHeader(reqMoq, jwtParserMoq);

        hotspotRepositoryMoq = TypeMoq.Mock.ofType<HotspotRepositoryInMemory>();
        hotspotFactoryMoq = TypeMoq.Mock.ofType<HotspotFactory>();
        hotspotCtrl = new HotspotCtrl(
            jwtParserMoq.object, hotspotRepositoryMoq.object, hotspotFactoryMoq.object);
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

        it('should returns an empty list if invalid coords query strings', () => {
            // Arrange
            queryStrings.north = 'bad format';
            reqMoq
            .setup((x : rest.Request) => x.query)
            .returns(() => queryStrings);

            hotspotRepositoryMoq
            .setup(x => x.findInArea(north, west, south, east))
            .returns(() => []);

            // Act
            hotspotCtrl.hotspots(reqMoq.object, resMoq.object, nextMoq.object);

            // Assert
            resMoq
            .verify(
                x => x.json(200, []),
                TypeMoq.Times.once());
        });
    });

    describe('postHotspots', () => {

        let jsonBody : any;

        before(() => {
            jsonBody = {
                title: 'my new hotspot',
                position: {
                    latitude: 12.23323,
                    longitude: 22.1112221,
                },
                cityId: '33273',
                message: 'a classic message',
                newAttr: 'random value',
                scope: 'private',
                type: HotspotType.WallMessage,
                iconType: HotspotIconType.Wall,
            };
        });

        it ('should create a new hotspot and return it with 200 OK', () => {
            // Arrange
            reqMoq
            .setup((x : rest.Request) => x.body)
            .returns(() => jsonBody);

            jsonBody.cityzen = cityzenFromJwt(hotspotCtrl.decodedJwtPayload);
            const fakeNewHotspot = new HotspotFactory().build(jsonBody);

            hotspotFactoryMoq
            .setup(x => x.build(jsonBody))
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
