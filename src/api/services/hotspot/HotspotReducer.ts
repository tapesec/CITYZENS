const isEqual = require('lodash.isequal');
import Hotspot, { HotspotType, HotspotScope } from '../../../domain/cityLife/model/hotspot/Hotspot';
import MediaHotspot from '../../../domain/cityLife/model/hotspot/MediaHotspot';
import Author from '../../../domain/cityLife/model/author/Author';
import Cityzen from '../../../domain/cityzens/model/Cityzen';

class HotspotReducer {
    constructor(
        protected hotspotCollection: Hotspot[],
        protected filteredHotspotCollections: Set<Hotspot> = new Set(),
    ) {}

    public pickPublicHotspot = (): HotspotReducer => {
        const publicHotspot = this.hotspotCollection.filter(hotspot => {
            if (hotspot instanceof MediaHotspot) {
                return hotspot.scope === HotspotScope.Public;
            }
            return true;
        });
        this.filteredHotspotCollections = new Set([
            ...this.filteredHotspotCollections,
            ...new Set(publicHotspot),
        ]);
        return this;
    };

    public pickHotspotOwnerShip = (author: Author): HotspotReducer => {
        if (author instanceof Author) {
            const hotspotOwnerShip = this.hotspotCollection.filter((hotspot: Hotspot) => {
                return isEqual(hotspot.author, author);
            });
            this.filteredHotspotCollections = new Set([
                ...this.filteredHotspotCollections,
                ...new Set(hotspotOwnerShip),
            ]);
        }
        return this;
    };

    public pickHotspotMemberShip = (cityzenId: string): HotspotReducer => {
        if (cityzenId) {
            const hotspotMemberShip = this.hotspotCollection.filter((hotspot: Hotspot) => {
                if (hotspot instanceof MediaHotspot) {
                    return hotspot.members.has(cityzenId);
                }
                return false;
            });
            this.filteredHotspotCollections = new Set([
                ...this.filteredHotspotCollections,
                ...new Set(hotspotMemberShip),
            ]);
        }
        return this;
    };

    public releaseFilteredHotspots = (): Hotspot[] => {
        return Array.from(this.filteredHotspotCollections);
    };

    public renderVisibleHotspotsByVisitorStatus = (visitor: any): Hotspot[] => {
        this.pickPublicHotspot();
        if (visitor && visitor instanceof Cityzen) {
            this.pickHotspotMemberShip(visitor.id);
            this.pickHotspotOwnerShip(new Author(visitor.pseudo, visitor.id));
        }
        return this.releaseFilteredHotspots();
    };
}

export default HotspotReducer;
