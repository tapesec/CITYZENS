import CityzenSample from '../../../../src/domain/cityzens/model/CityzenSample';
import Author from '../../../../src/domain/cityLife/model/author/Author';

import { expect } from 'chai';

describe('Author entity', () => {

    it('Should have correct properties set by constructor', () => {
        // Arrange
        const pseudo : string = CityzenSample.LOUISE.pseudo;
        const email : string = CityzenSample.LOUISE.email;
        // Act
        const louise : Author = new Author(pseudo, email);
        // Assert
        expect(louise.pseudo).to.be.equal(pseudo);
    });
});
