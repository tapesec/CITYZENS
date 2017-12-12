import { expect } from 'chai';
import * as helpers from '../../../../src/api/helpers';

describe('Helpers', () => {

    describe('strToNumQueryStringsProperties', () => {

        it ('should parse given strings and convert to number', () => {
            // Arrange
            const queryStrings = {
                foo: 'string',
                n: '123',
                n2: '1.232',
                n3: '-1.23',
                n4: '0',
            };
            // Act
            const parsedQs = helpers.strToNumQSProps(queryStrings, ['n', 'n2', 'n3', 'n4']);
            // Assert
            expect(parsedQs.n2).to.equal(1.232);
            expect(parsedQs.n).to.equal(123);
            expect(parsedQs.n3).to.equal(-1.23);
            expect(parsedQs.n4).to.equal(0);
        });
    });
});
