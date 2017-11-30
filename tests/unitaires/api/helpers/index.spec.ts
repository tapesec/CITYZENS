import { expect } from 'chai';
import * as helpers from '../../../../src/api/helpers';

describe('Helpers', () => {

    describe('latitudeLongitude', () => {

        let queryStrings : any;

        beforeEach(() => {
            // Arrange
            const north = '1.23432878';
            const south = '-2.3336827';
            const east = '21.011221212';
            const west = '-2.3434333';

            queryStrings = {
                north,
                south,
                east,
                west,
            };
        });

        it('should return false if a coords contain a character', () => {
            // Arrange
            queryStrings.north = '1.23432878a';
            // Assert
            expect(helpers.latitudeLongitude(queryStrings)).to.be.false;
        });

        it('should return false if a coords contain a character in middle of the coords', () => {
            // Arrange
            queryStrings.north = '1.234a32878';
            // Assert
            expect(helpers.latitudeLongitude(queryStrings)).to.be.false;
        });

        it('should return false if a coords is undefined', () => {
            // Arrange
            queryStrings.north = undefined;
            // Assert
            expect(helpers.latitudeLongitude(queryStrings)).to.be.false;
        });
    });
});
