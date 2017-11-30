import HotspotSample from '../../../../../src/domain/cityLife/model/sample/HotspotSample';
import CityzenSample from '../../../../../src/domain/cityzens/model/CityzenSample';
import Cityzen from '../../../../../src/domain/cityzens/model/Cityzen';
import { expect } from 'chai';

describe('Cityzens entity', () => {
    it('Should have correct properties set by constructor', () => {
        // Arrange
        const id = 'auth0|fake-id1';
        const email : string = 'mail@mailbox.com';
        const pseudo : string = 'kenny';
        const favoritsHotspots : string[] = ['fake-id', 'fake-id-2'];
        const description : string = 'fake description';
        // Act
        const kenny : Cityzen = new Cityzen(id, email, pseudo, favoritsHotspots, description);
        // Arrange
        expect(kenny.email).to.be.equal(email);
        expect(kenny.pseudo).to.be.equal(pseudo);
        expect(kenny.favoritesHotspots).to.be.eql(['fake-id', 'fake-id-2']);
        expect(kenny.description).to.be.equal(description);
    });

    it('Should edit his description', () => {
        // Arrange
        const elodie : Cityzen = CityzenSample.ELODIE;
        const newDescription : string = 'new fake description';
        // Act
        elodie.editDescription(newDescription);
        // Assert
        expect(elodie.description).to.be.equal(newDescription);
    });

    it('Should add an hotspot as favorit', () => {
        // Arrange
        const elodie : Cityzen = CityzenSample.ELODIE;
        const favoritHotspotId : string = HotspotSample.SCHOOL.id;
        // Act
        elodie.addHotspotAsFavorit(favoritHotspotId);
        // Assert
        expect(elodie.favoritesHotspots).to.be.lengthOf(1);
        expect(elodie.favoritesHotspots[0]).to.be.equal(favoritHotspotId);
    });
});
