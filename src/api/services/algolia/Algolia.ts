import MediaHotspot from '../../../domain/hotspot/MediaHotspot';
import AlgoliaAPI from './../../../api/libs/AlgoliaAPI';
import AlertHotspot from '../../../domain/hotspot/AlertHotspot';
import Hotspot from '../../../domain/hotspot/Hotspot';

class Algolia {
    constructor(protected algolia: AlgoliaAPI) {}

    public initHotspots(): void {
        this.algolia.initIndex('hotspots');
    }

    public addHotspot<T extends Hotspot>(hotspot: T): Promise<any> {
        const data: any = {
            address: hotspot.address.name,
            cityId: hotspot.cityId,
            type: hotspot.type,
            _geoloc: {
                lat: hotspot.position.latitude,
                lng: hotspot.position.longitude,
            },
        };
        if (hotspot instanceof AlertHotspot) {
            data.message = hotspot.message;
        } else if (hotspot instanceof MediaHotspot) {
            data.title = hotspot.title;
            data.slug = hotspot.slug;
            data.avatarIconUrl = hotspot.avatarIconUrl.toString();
        }

        return this.algolia.sendObject('hotspots', data, hotspot.id.toString());
    }
}

export default Algolia;
