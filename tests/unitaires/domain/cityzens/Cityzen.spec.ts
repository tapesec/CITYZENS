import { expect } from 'chai';
import MediaHotspotSample from '../../../../src/domain/model/sample/MediaHotspotSample';
import Cityzen from '../../../../src/domain/cityzen/Cityzen';
import CityzenId from '../../../../src/domain/cityzen/CityzenId';
import CityzenSample from '../../../../src/domain/model/sample/CityzenSample';

describe('Cityzens entity', () => {
    it('Should have correct properties set by constructor', () => {
        // Arrange
        const id = new CityzenId('auth0|fake-id1');
        const email: string = 'mail@mailbox.com';
        const pseudo: string = 'kenny';
        const favoritsHotspots = new Set<string>(['fake-id', 'fake-id-2']);
        const description: string = 'fake description';
        // Act
        const kenny: Cityzen = new Cityzen(id, email, pseudo, false, favoritsHotspots, description);
        // Arrange
        expect(kenny.email).to.be.equal(email);
        expect(kenny.pseudo).to.be.equal(pseudo);
        expect(kenny.favoritesHotspots).to.be.eql(favoritsHotspots);
        expect(kenny.description).to.be.equal(description);
    });

    it('Should edit his description', () => {
        // Arrange
        const elodie: Cityzen = CityzenSample.ELODIE;
        const newDescription: string = 'new fake description';
        // Act
        elodie.editDescription(newDescription);
        // Assert
        expect(elodie.description).to.be.equal(newDescription);
    });

    it('Should add an hotspot as favorit', () => {
        // Arrange
        const elodie: Cityzen = CityzenSample.ELODIE;
        const favoritHotspotId: string = MediaHotspotSample.SCHOOL.id;
        // Act
        elodie.addHotspotAsFavorit(favoritHotspotId);
        // Assert
        expect(elodie.favoritesHotspots.size).to.be.equal(1);
        expect(elodie.favoritesHotspots.has(favoritHotspotId)).to.be.true;
    });

    it('Should parse and stringify correctly.', () => {
        const elodie: Cityzen = JSON.parse(JSON.stringify(CityzenSample.ELODIE));

        expect(elodie)
            .to.have.property('description')
            .to.be.equal(elodie.description);

        expect(elodie)
            .to.have.property('email')
            .to.be.equal(elodie.email);

        expect(elodie)
            .to.have.property('favoritesHotspots')
            .to.be.equal(elodie.favoritesHotspots);

        expect(elodie)
            .to.have.property('id')
            .to.be.equal(elodie.id);

        expect(elodie)
            .to.have.property('isAdmin')
            .to.be.equal(elodie.isAdmin);

        expect(elodie)
            .to.have.property('pseudo')
            .to.be.equal(elodie.pseudo);
    });
});
