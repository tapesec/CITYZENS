import City from '../../../../src/application/domain/city/City';
import { expect } from 'chai';
import Position from '../../../../src/application/domain/model/Position';
import PositionSample from '../../../../src/application/domain/sample/PositionSample';
import PolygonSample from '../../../../src/application/domain/sample/PolygonSample';

describe('City entity', () => {
    it ('should have correct properties', () => {
        // Arrange
        const name : string = 'fake city';
        const insee : string = '12345';
        const position2D : Position = PositionSample.CHURCH;
        // Act
        const fakeCity = new City(name, insee, position2D, PolygonSample.MARTIGNAS_SUR_JALLE);
        // Arrange
        expect(fakeCity).to.have.property('name');
        expect(fakeCity).to.have.property('insee');
        expect(fakeCity).to.have.property('polygon');
        expect(fakeCity).to.have.property('position');
    });
});
