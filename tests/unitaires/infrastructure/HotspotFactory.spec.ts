import CityzenSample from '../../../src/domain/cityzens/model/CityzenSample';
import HotspotFactory from '../../../src/infrastructure/HotspotFactory';
import cityzenFromJwt from '../../../src/api/services/cityzen/cityzenFromJwt';
import { expect } from 'chai';
describe('HotspotFactory', () => {

    it ('createHotspot method with data from post request should return a new hotspot', () => {
        // Arrange
        const fakeDataFromRequestPost : any = {
            title: 'new title',
            position: {
                latitude: 12.25632,
                longitude: 47.12345,
            },
            author: {
                pseudo: CityzenSample.ELODIE.pseudo,
                id: CityzenSample.ELODIE.id,
            },
            scope: 'private',
            address: {
                name: '4 rue Blanc',
                city: 'Martignas sur Jalles',
            },
            cityId: '34345',
        };

        fakeDataFromRequestPost.cityzen = CityzenSample.ELODIE;
        const hotspotFactory = new HotspotFactory();
        // Act
        const fakeNewHotspot = hotspotFactory.build(fakeDataFromRequestPost);
        // Assert
        expect(fakeNewHotspot).to.have.property('id');
        commonHotspotPropertiesAssertion(fakeNewHotspot);
    });

    it ('createHotspot method  with data from database should return a new hotspot', () => {
        // Arrange
        const fakeDataFromDatabase : any = {
            id: 'fake-id',
            title: 'new title',
            position: {
                latitude: 12.25632,
                longitude: 47.12345,
            },
            cityzen: CityzenSample.ELODIE,
            author: {
                pseudo: CityzenSample.ELODIE.pseudo,
                id: CityzenSample.ELODIE.id,
            },
            scope: 'private',
            address: {
                name: '4 rue Blanc',
                city: 'Martignas sur Jalles',
            },
            id_city: '34345',
        };
        const hotspotFactory = new HotspotFactory();
        // Act
        const fakeNewHotspot = hotspotFactory.build(fakeDataFromDatabase);
        // Assert
        expect(fakeNewHotspot).to.have.property('id').and.to.be.equal('fake-id');
        commonHotspotPropertiesAssertion(fakeNewHotspot);
    });
});

const commonHotspotPropertiesAssertion = (fakeNewHotspot : any) : void => {
    expect(fakeNewHotspot).to.have.property('title').and.to.be.equal('new title');
    expect(fakeNewHotspot).to.have.property('scope').and.to.be.equal('private');
    expect(fakeNewHotspot).to.have.property('idCity').and.to.be.equal('34345');
    expect(fakeNewHotspot).to.have.property('position').to.have.property('latitude')
    .to.be.equal(12.25632);
    expect(fakeNewHotspot).to.have.property('position').to.have.property('longitude')
    .to.be.equal(47.12345);
    expect(fakeNewHotspot).to.have.property('author').to.have.property('pseudo')
    .to.be.equal('Princesse');
    expect(fakeNewHotspot).to.have.property('author').to.have.property('id')
    .to.be.equal(CityzenSample.ELODIE.id);
    expect(fakeNewHotspot).to.have.property('position').to.have.property('longitude')
    .to.be.equal(47.12345);
    expect(fakeNewHotspot).to.have.property('address').to.have.property('name')
    .to.be.equal('4 rue Blanc');
    expect(fakeNewHotspot).to.have.property('address').to.have.property('city')
    .to.be.equal('Martignas sur Jalles');
};
