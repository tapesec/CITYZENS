import * as Chai from 'chai';
import Message from '../../../../src/application/domain/hotspot/Message';
import AlertHotspotSample from '../../../../src/application/domain/sample/AlertHotspotSample';
import AuthorSample from '../../../../src/application/domain/sample/AuthorSample';
import MediaHotspotSample from '../../../../src/application/domain/sample/MediaHotspotSample';
import MessageSample from '../../../../src/application/domain/sample/MessageSample';
import Cityzen from '../../../../src/application/domain/cityzen/Cityzen';
import CityzenId from '../../../../src/application/domain/cityzen/CityzenId';
import CityzenSample from '../../../../src/application/domain/sample/CityzenSample';
import * as isAuthorized from '../../../../src/application/domain/hotspot/services/isAuthorized';

describe("isAuthorized's functions.", () => {
    it('toSeeHotspots', () => {
        const authorizedHotspots = [
            MediaHotspotSample.SCHOOL,
            AlertHotspotSample.ACCIDENT,
            MediaHotspotSample.MATCH_EVENT,
        ];

        const privateHotspots = [MediaHotspotSample.DOCTOR];

        const authorizedCityzens = [
            CityzenSample.ELODIE,
            CityzenSample.LIONNEL,
            CityzenSample.LUCA,
        ];
        const unauthorizedCityzens = [new Cityzen(new CityzenId(''), '', '', false), undefined];

        authorizedHotspots.forEach(hotspot => {
            authorizedCityzens.forEach(cityzen => {
                Chai.expect(isAuthorized.toSeeHotspot(hotspot, cityzen)).to.be.true;
            });
            unauthorizedCityzens.forEach(cityzen => {
                Chai.expect(isAuthorized.toSeeHotspot(hotspot, cityzen)).to.be.true;
            });
        });

        privateHotspots.forEach(hotspot => {
            authorizedCityzens.forEach(cityzen => {
                Chai.expect(isAuthorized.toSeeHotspot(hotspot, cityzen)).to.be.true;
            });
            unauthorizedCityzens.forEach(cityzen => {
                Chai.expect(isAuthorized.toSeeHotspot(hotspot, cityzen)).to.be.false;
            });
        });
    });

    it('toSeeMessages', () => {
        const authorizedHotspots = [
            MediaHotspotSample.SCHOOL,
            AlertHotspotSample.ACCIDENT,
            MediaHotspotSample.MATCH_EVENT,
        ];

        const privateHotspots = [MediaHotspotSample.DOCTOR];

        const authorizedCityzens = [
            CityzenSample.ELODIE,
            CityzenSample.LIONNEL,
            CityzenSample.LUCA,
        ];
        const unauthorizedCityzens = [new Cityzen(new CityzenId(''), '', '', false), undefined];

        authorizedHotspots.forEach(hotspot => {
            authorizedCityzens.forEach(cityzen => {
                Chai.expect(isAuthorized.toSeeMessages(hotspot, cityzen)).to.be.true;
            });
            unauthorizedCityzens.forEach(cityzen => {
                Chai.expect(isAuthorized.toSeeMessages(hotspot, cityzen)).to.be.true;
            });
        });

        privateHotspots.forEach(hotspot => {
            authorizedCityzens.forEach(cityzen => {
                Chai.expect(isAuthorized.toSeeMessages(hotspot, cityzen)).to.be.true;
            });
            unauthorizedCityzens.forEach(cityzen => {
                Chai.expect(isAuthorized.toSeeMessages(hotspot, cityzen)).to.be.false;
            });
        });
    });

    it('toAddMember', () => {
        const authorizedhotspots = [];

        const privateHotspots = [MediaHotspotSample.TOEDIT];

        // the author and the one and only god of all cityzens, the one whose name should be sanctify, his reign will comme.
        const authorizedCityzens = [CityzenSample.ELODIE, CityzenSample.LIONNEL];
        const unauthorizedCityzens = [
            new Cityzen(new CityzenId(''), '', '', false),
            undefined,
            CityzenSample.MARTIN,
        ];

        authorizedhotspots.forEach(hotspot => {
            authorizedCityzens.forEach(cityzen => {
                Chai.expect(isAuthorized.toAddMember(hotspot, cityzen)).to.be.true;
            });
            unauthorizedCityzens.forEach(cityzen => {
                Chai.expect(isAuthorized.toAddMember(hotspot, cityzen)).to.be.true;
            });
        });

        privateHotspots.forEach(hotspot => {
            authorizedCityzens.forEach(cityzen => {
                Chai.expect(isAuthorized.toAddMember(hotspot, cityzen)).to.be.true;
            });
            unauthorizedCityzens.forEach(cityzen => {
                Chai.expect(isAuthorized.toAddMember(hotspot, cityzen)).to.be.false;
            });
        });
    });

    it('toPostMessages', () => {
        const authorizedhotspots = [];

        const privateHotspots = [MediaHotspotSample.TOEDIT];

        const authorizedCityzens = [CityzenSample.LIONNEL, CityzenSample.ELODIE];
        const unauthorizedCityzens = [
            new Cityzen(new CityzenId(''), '', '', false),
            undefined,
            CityzenSample.MARTIN,
        ];

        authorizedhotspots.forEach(hotspot => {
            authorizedCityzens.forEach(cityzen => {
                Chai.expect(isAuthorized.toPostMessages(hotspot, cityzen)).to.be.true;
            });
            unauthorizedCityzens.forEach(cityzen => {
                Chai.expect(isAuthorized.toPostMessages(hotspot, cityzen)).to.be.true;
            });
        });

        privateHotspots.forEach(hotspot => {
            authorizedCityzens.forEach(cityzen => {
                Chai.expect(isAuthorized.toPostMessages(hotspot, cityzen)).to.be.true;
            });
            unauthorizedCityzens.forEach(cityzen => {
                Chai.expect(isAuthorized.toPostMessages(hotspot, cityzen)).to.be.false;
            });
        });
    });

    it('toPatchHotspot', () => {
        const authorizedhotspots = [];

        const privateHotspots = [MediaHotspotSample.TOEDIT];

        const authorizedCityzens = [CityzenSample.LIONNEL, CityzenSample.ELODIE];
        const unauthorizedCityzens = [
            new Cityzen(new CityzenId(''), '', '', false),
            undefined,
            CityzenSample.MARTIN,
        ];

        authorizedhotspots.forEach(hotspot => {
            authorizedCityzens.forEach(cityzen => {
                Chai.expect(isAuthorized.toPatchHotspot(hotspot, cityzen)).to.be.true;
            });
            unauthorizedCityzens.forEach(cityzen => {
                Chai.expect(isAuthorized.toPatchHotspot(hotspot, cityzen)).to.be.true;
            });
        });

        privateHotspots.forEach(hotspot => {
            authorizedCityzens.forEach(cityzen => {
                Chai.expect(isAuthorized.toPatchHotspot(hotspot, cityzen)).to.be.true;
            });
            unauthorizedCityzens.forEach(cityzen => {
                Chai.expect(isAuthorized.toPatchHotspot(hotspot, cityzen)).to.be.false;
            });
        });
    });

    it('toPatchMessages', () => {
        const authorizedhotspots = [];

        const privateHotspots = [MediaHotspotSample.TOEDIT];

        const authorizedCityzens = [CityzenSample.LIONNEL, CityzenSample.ELODIE];
        const unauthorizedCityzens = [
            new Cityzen(new CityzenId(''), '', '', false),
            undefined,
            CityzenSample.MARTIN,
        ];

        authorizedhotspots.forEach(hotspot => {
            authorizedCityzens.forEach(cityzen => {
                Chai.expect(isAuthorized.toPatchMessages(hotspot, cityzen)).to.be.true;
            });
            unauthorizedCityzens.forEach(cityzen => {
                Chai.expect(isAuthorized.toPatchMessages(hotspot, cityzen)).to.be.true;
            });
        });

        privateHotspots.forEach(hotspot => {
            authorizedCityzens.forEach(cityzen => {
                Chai.expect(isAuthorized.toPatchMessages(hotspot, cityzen)).to.be.true;
            });
            unauthorizedCityzens.forEach(cityzen => {
                Chai.expect(isAuthorized.toPatchMessages(hotspot, cityzen)).to.be.false;
            });
        });
    });

    it('toPatchMessage', () => {
        const authorizedhotspots = [];

        const privateHotspots = [MediaHotspotSample.TOEDIT];

        const authorizedCityzens = [CityzenSample.LIONNEL, CityzenSample.ELODIE];
        const unauthorizedCityzens = [
            new Cityzen(new CityzenId(''), '', '', false),
            undefined,
            CityzenSample.MARTIN,
        ];

        const message = new Message(
            '',
            '',
            '',
            AuthorSample.ELODIE,
            false,
            MediaHotspotSample.TOEDIT.id,
            new Date(),
            new Date(),
        );

        authorizedhotspots.forEach(hotspot => {
            authorizedCityzens.forEach(cityzen => {
                Chai.expect(isAuthorized.toPatchMessage(message, cityzen)).to.be.true;
            });
            unauthorizedCityzens.forEach(cityzen => {
                Chai.expect(isAuthorized.toPatchMessage(message, cityzen)).to.be.true;
            });
        });

        privateHotspots.forEach(hotspot => {
            authorizedCityzens.forEach(cityzen => {
                Chai.expect(isAuthorized.toPatchMessage(message, cityzen)).to.be.true;
            });
            unauthorizedCityzens.forEach(cityzen => {
                Chai.expect(isAuthorized.toPatchMessage(message, cityzen)).to.be.false;
            });
        });
    });

    it('toRemoveHotspot', () => {
        const authorizedhotspots = [];

        const privateHotspots = [MediaHotspotSample.TOEDIT];

        const authorizedCityzens = [CityzenSample.LIONNEL, CityzenSample.ELODIE];
        const unauthorizedCityzens = [
            new Cityzen(new CityzenId(''), '', '', false),
            undefined,
            CityzenSample.MARTIN,
        ];

        authorizedhotspots.forEach(hotspot => {
            authorizedCityzens.forEach(cityzen => {
                Chai.expect(isAuthorized.toRemoveHotspot(hotspot, cityzen)).to.be.true;
            });
            unauthorizedCityzens.forEach(cityzen => {
                Chai.expect(isAuthorized.toRemoveHotspot(hotspot, cityzen)).to.be.true;
            });
        });

        privateHotspots.forEach(hotspot => {
            authorizedCityzens.forEach(cityzen => {
                Chai.expect(isAuthorized.toRemoveHotspot(hotspot, cityzen)).to.be.true;
            });
            unauthorizedCityzens.forEach(cityzen => {
                Chai.expect(isAuthorized.toRemoveHotspot(hotspot, cityzen)).to.be.false;
            });
        });
    });

    it('toRemoveMessages', () => {
        const authorizedMessages = [];

        const privateMessages = [
            MessageSample.MARTIGNAS_CHURCH_MESSAGE,
            MessageSample.MARTIGNAS_SCHOOL_MESSAGE,
        ];

        const authorizedCityzens = [CityzenSample.LIONNEL, CityzenSample.LUCA];
        const unauthorizedCityzens = [CityzenSample.ELODIE];

        authorizedMessages.forEach(message => {
            authorizedCityzens.forEach(cityzen => {
                Chai.expect(isAuthorized.toRemoveMessages(message, cityzen)).to.be.true;
            });
            unauthorizedCityzens.forEach(cityzen => {
                Chai.expect(isAuthorized.toRemoveMessages(message, cityzen)).to.be.true;
            });
        });

        privateMessages.forEach(message => {
            authorizedCityzens.forEach(cityzen => {
                Chai.expect(isAuthorized.toRemoveMessages(message, cityzen)).to.be.true;
            });
            unauthorizedCityzens.forEach(cityzen => {
                Chai.expect(isAuthorized.toRemoveMessages(message, cityzen)).to.be.false;
            });
        });
    });
});
