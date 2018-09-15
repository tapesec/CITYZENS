import CityzenSample from '../../../../../src/domain/model/sample/CityzenSample';
import Author from '../../../../../src/domain/model/Author';

import { expect } from 'chai';
import ImageLocation from '../../../../../src/domain/model/ImageLocation';

describe('Author entity', () => {
    it('Should have correct properties set by constructor', () => {
        // Arrange
        const pseudo: string = CityzenSample.LOUISE.pseudo;
        const id = CityzenSample.LOUISE.id;
        // Act
        const louise: Author = new Author(pseudo, id, new ImageLocation(), new ImageLocation());
        // Assert
        expect(louise.pseudo).to.be.equal(pseudo);
        expect(louise.id).to.be.equal(id);
    });
});
