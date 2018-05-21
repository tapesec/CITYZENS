import WallHotspotSample from '../../../../src/domain/cityLife/model/sample/WallHotspotSample';
import AlertHotspotSample from '../../../../src/domain/cityLife/model/sample/AlertHotspotSample';
import MediaHotspotSample from '../../../../src/domain/cityLife/model/sample/MediaHotspotSample';
import CityzenSample from '../../../../src/domain/cityzens/model/CityzenSample';
import Cityzen from '../../../../src/domain/cityzens/model/Cityzen';
import * as isAuthorized from './../../../../src/api/services/hotspot/isAuthorized';
import * as Chai from 'chai';
import Message from '../../../../src/domain/cityLife/model/messages/Message';
import AuthorSample from '../../../../src/domain/cityLife/model/sample/AuthorSample';
import HotspotId from '../../../../src/domain/cityLife/model/hotspot/HotspotId';
import CityzenId from '../../../../src/domain/cityzens/model/CityzenId';

describe("isAuthorized's functions.", () => {
    it('toSeeHotspots', () => {
        const authorizedHotspots = [
            WallHotspotSample.SCHOOL,
            AlertHotspotSample.ACCIDENT,
            MediaHotspotSample.MATCH_EVENT,
        ];

        const privateHotspots = [WallHotspotSample.DOCTOR];

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
            WallHotspotSample.SCHOOL,
            AlertHotspotSample.ACCIDENT,
            MediaHotspotSample.MATCH_EVENT,
        ];

        const privateHotspots = [WallHotspotSample.DOCTOR];

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

        const privateHotspots = [WallHotspotSample.TOEDIT];

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

        const privateHotspots = [WallHotspotSample.TOEDIT];

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

        const privateHotspots = [WallHotspotSample.TOEDIT];

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

        const privateHotspots = [WallHotspotSample.TOEDIT];

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

        const privateHotspots = [WallHotspotSample.TOEDIT];

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
            new HotspotId(WallHotspotSample.TOEDIT.id),
            new Date(),
            new Date(),
        );

        authorizedhotspots.forEach(hotspot => {
            authorizedCityzens.forEach(cityzen => {
                Chai.expect(isAuthorized.toPatchMessage(hotspot, message, cityzen)).to.be.true;
            });
            unauthorizedCityzens.forEach(cityzen => {
                Chai.expect(isAuthorized.toPatchMessage(hotspot, message, cityzen)).to.be.true;
            });
        });

        privateHotspots.forEach(hotspot => {
            authorizedCityzens.forEach(cityzen => {
                Chai.expect(isAuthorized.toPatchMessage(hotspot, message, cityzen)).to.be.true;
            });
            unauthorizedCityzens.forEach(cityzen => {
                Chai.expect(isAuthorized.toPatchMessage(hotspot, message, cityzen)).to.be.false;
            });
        });
    });

    it('toRemoveHotspot', () => {
        const authorizedhotspots = [];

        const privateHotspots = [WallHotspotSample.TOEDIT];

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
        const authorizedhotspots = [];

        const privateHotspots = [WallHotspotSample.TOEDIT];

        const authorizedCityzens = [CityzenSample.LIONNEL, CityzenSample.ELODIE];
        const unauthorizedCityzens = [
            new Cityzen(new CityzenId(''), '', '', false),
            undefined,
            CityzenSample.MARTIN,
        ];

        authorizedhotspots.forEach(hotspot => {
            authorizedCityzens.forEach(cityzen => {
                Chai.expect(isAuthorized.toRemoveMessages(hotspot, cityzen)).to.be.true;
            });
            unauthorizedCityzens.forEach(cityzen => {
                Chai.expect(isAuthorized.toRemoveMessages(hotspot, cityzen)).to.be.true;
            });
        });

        privateHotspots.forEach(hotspot => {
            authorizedCityzens.forEach(cityzen => {
                Chai.expect(isAuthorized.toRemoveMessages(hotspot, cityzen)).to.be.true;
            });
            unauthorizedCityzens.forEach(cityzen => {
                Chai.expect(isAuthorized.toRemoveMessages(hotspot, cityzen)).to.be.false;
            });
        });
    });
});
