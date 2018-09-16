import City from '../../../src/domain/city/City';
import cityRepositoryInMemory from '../../../src/infrastructure/CityRepositoryInMemory';
import CitySample from '../../../src/domain/model/sample/CitySample';
import { expect } from 'chai';

describe('City repository in memory', () => {

    beforeEach(() => {
        cityRepositoryInMemory.store(CitySample.MARTIGNAS);
    });

    afterEach(() => {
        cityRepositoryInMemory.remove(CitySample.MARTIGNAS.insee);
    });

    after(() => {
        cityRepositoryInMemory.store(CitySample.MARTIGNAS);
    });

    it ('should find a city by insee code commune', () => {
        // Arrange
        const insee = CitySample.MARTIGNAS.insee;
        // Act
        const city : City = cityRepositoryInMemory.findByInsee(insee);
        // Act
        expect(city).instanceOf(City);
    });

    it ('should remove a city by insee code commune', () => {
        // Arrange
        const insee = CitySample.MARTIGNAS.insee;
        // Act
        cityRepositoryInMemory.remove(insee);
        const city : City = cityRepositoryInMemory.findByInsee(insee);
        // Act
        expect(city).to.be.undefined;
    });

});
