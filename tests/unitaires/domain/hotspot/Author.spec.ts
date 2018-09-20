import CityzenSample from '../../../../src/application/domain/sample/CityzenSample';
import Author from '../../../../src/application/domain/hotspot/Author';

import { expect } from 'chai';
import ImageLocation from '../../../../src/application/domain/hotspot/ImageLocation';

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
