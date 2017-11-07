import City from '../../../../src/domain/cityLife/model/City';
import { expect } from 'chai';
import Position from '../../../../src/domain/cityLife/model/Position';
import PositionSample from '../../../../src/domain/cityLife/model/PositionSample';

describe('City entity', () => {
    it ('should have correct properties', () => {
        // Arrange
        const name : string = 'fake city';
        const insee : string = '12345';
        const position2D : Position = PositionSample.CHURCH;
        // Act
        const fakeCity = new City(name, insee, position2D);
        // Arrange
        expect(fakeCity).to.have.property('name');
        expect(fakeCity).to.have.property('insee');
        expect(fakeCity).to.have.property('position');
    });
});
