// tslint:disable-next-line:import-name
import { Response } from '_debugger';
import JwtParser from '../../../src/api/services/auth/JwtParser';
import * as querystring from 'querystring';
import HotspotSample from '../../../src/domain/cityLife/model/HotspotSample';
// tslint:disable-next-line:import-name
import hotspotRepositoryInMemory, { HotspotRepositoryInMemory }
from '../../../src/domain/cityLife/infrastructure/HotspotRepositoryInMemory';
import HotspotCtrl from '../../../src/api/controllers/HotspotCtrl';
const restifyErrors = require('restify-errors');
import * as TypeMoq from 'typemoq';
import * as rest from 'restify';

describe('HotspotCtrl', () => {

    let reqMoq : TypeMoq.IMock<rest.Request>;
    let resMoq : TypeMoq.IMock<rest.Response>;
    let nextMoq : TypeMoq.IMock<rest.Next>;
    let hotspotRepositoryMoq : TypeMoq.IMock<HotspotRepositoryInMemory>;
    let jwtParser : TypeMoq.IMock<JwtParser>;
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
        repositoryResult = [HotspotSample.CHURCH, HotspotSample.SCHOOL];
        queryStrings = {
            north,
            south,
            east,
            west,
        };
    });

    beforeEach(() => {
        reqMoq = TypeMoq.Mock.ofType<rest.Request>();
        resMoq = TypeMoq.Mock.ofType<rest.Response>();
        nextMoq = TypeMoq.Mock.ofType<rest.Next>();
        hotspotRepositoryMoq = TypeMoq.Mock.ofType<HotspotRepositoryInMemory>();
        jwtParser = TypeMoq.Mock.ofType<JwtParser>();
    });

    describe('hotspots', () => {
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
            new HotspotCtrl(jwtParser.object, hotspotRepositoryMoq.object).hotspots(
                reqMoq.object,
                resMoq.object,
                nextMoq.object,
            );
            // Assert
            resMoq
            .verify(
                x => x.send(JSON.stringify(repositoryResult)),
                TypeMoq.Times.once());
        });

        it('should next bad request error if invalid coords query strings', () => {
            // Arrange
            queryStrings.north = 'bad format';
            reqMoq
            .setup((x : rest.Request) => x.query)
            .returns(() => queryStrings);
            const errorMessage : string = 'Invalid latitude/longitude format';
            const badFormatError = new restifyErrors.BadRequestError(errorMessage);

            hotspotRepositoryMoq
            .setup(x => x.findInArea(north, west, south, east))
            .returns(() => []);

             // Act
            new HotspotCtrl(jwtParser.object, hotspotRepositoryMoq.object).hotspots(
                reqMoq.object,
                resMoq.object,
                nextMoq.object,
            );

            // Assert
            nextMoq
            .verify(
                x => x(badFormatError),
                TypeMoq.Times.once());
        });
    });
});
