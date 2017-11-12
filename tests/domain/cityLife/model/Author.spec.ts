import CityzenSample from '../../../../src/domain/cityzens/model/CityzenSample';
import Author from '../../../../src/domain/cityLife/model/hotspot/Author';

import { expect } from 'chai';

describe('Author value object', () => {

    it('Should have correct properties set by constructor', () => {
        // Arrange
        const pseudo : string = CityzenSample.LOUISE.pseudo;
        // Act
        const louise : Author = new Author(pseudo);
        // Assert
        expect(louise.pseudo).to.be.equal(pseudo);
    });
});
