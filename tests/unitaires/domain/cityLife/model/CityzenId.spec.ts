import CityzenSample from '../../../../../src/domain/model/sample/CityzenSample';
import CityzenId from '../../../../../src/domain/model/CityzenId';

import { expect } from 'chai';

describe('Author entity', () => {
    it('Should have correct properties set by constructor', () => {
        // Arrange
        const id = 'fake id';
        // Act
        const louise = new CityzenId(id);
        // Assert
        expect(louise.id).to.be.equal(id);
        expect(louise.toString()).to.be.equal(id);
    });
});
