import Hotspot, { HotspotScope, HotspotType } from '../../../../../src/domain/cityLife/model/hotspot/Hotspot';
import AddressSample from '../../../../../src/domain/cityLife/model/sample/AddressSample';
import PositionSample from '../../../../../src/domain/cityLife/model/sample/PositionSample';
import AuthorSample from '../../../../../src/domain/cityLife/model/sample/AuthorSample';

import { expect } from 'chai';
import { v4 } from 'uuid';

describe('Hotspot entity', () => {

    it.only('Should have correct properties set by constructor', () => {
        // Arrange
        const id: string = v4();
        const title: string = 'Mairie';
        // Act
        const hotspot: Hotspot = new Hotspot(
            id,
            title,
            PositionSample.MARTIGNAS_NORTH_OUEST,
            AuthorSample.LOUISE,
            '33273',
            AddressSample.TOWNHALL_ADDRESS,
            HotspotType.Accident,
        );
        // Assert
        expect(hotspot.id).to.be.equal(id);
        expect(hotspot.position).to.be.equal(PositionSample.MARTIGNAS_NORTH_OUEST);
        expect(hotspot.title).to.be.equal(title);
        expect(hotspot.author).to.be.equal(AuthorSample.LOUISE);
        expect(hotspot.type).to.be.equal('Accident');
    });

    it('Should move to new position', () => {
        // Arrange
        const id: string = v4();
        const title: string = 'Mairie';
        const hotspot: Hotspot = new Hotspot(
            id,
            title,
            PositionSample.MARTIGNAS_NORTH_OUEST,
            AuthorSample.LOUISE,
            '33273',
            AddressSample.SCHOOL_ADDRESS,
            HotspotScope.Public,
        );
        // Act
        hotspot.moveTo(
            PositionSample.MARTIGNAS_SOUTH_EST.latitude,
            PositionSample.MARTIGNAS_SOUTH_EST.longitude,
        );
        // Assert
        expect(hotspot.position).to.be.eql(PositionSample.MARTIGNAS_SOUTH_EST);
    });

    it('should change title', () => {
        // Arrange
        const id : string = v4();
        const title : string = 'Mairie';
        const newTitle : string = 'Ecole primaire';
        const hotspot : Hotspot = new Hotspot(
            id,
            title,
            PositionSample.MARTIGNAS_NORTH_OUEST,
            AuthorSample.LOUISE,
            '33273',
            AddressSample.SCHOOL_ADDRESS,
            HotspotScope.Public,
        );
        // Act
        hotspot.changeTitle(newTitle);
        // assert
        expect(hotspot.title).to.be.equal(newTitle);
    });

    it('should change address', () => {

        // Arrange
        const id : string = v4();
        const title : string = 'Mairie';
        const newAddress : string = '2 rue Gustave Dubourg';
        const hotspot : Hotspot = new Hotspot(
            id,
            title,
            PositionSample.MARTIGNAS_NORTH_OUEST,
            AuthorSample.LOUISE,
            '33273',
            AddressSample.SCHOOL_ADDRESS,
            HotspotScope.Public,
        );
        // Act
        hotspot.changeAddress(newAddress);
        // assert
        expect(hotspot.address.name).to.be.equal(newAddress);
    });

    it('should change scope', () => {

        // Arrange
        const id : string = v4();
        const title : string = 'Mairie';
        const newScope : HotspotScope = HotspotScope.Private;
        const hotspot : Hotspot = new Hotspot(
            id,
            title,
            PositionSample.MARTIGNAS_NORTH_OUEST,
            AuthorSample.LOUISE,
            '33273',
            AddressSample.SCHOOL_ADDRESS,
            HotspotScope.Public,
        );
        // Act
        hotspot.changeScope(newScope);
        // assert
        expect(hotspot.scope).to.be.equal(newScope);
    });
});
