import Author from '../../../domain/model/Author';
import Hotspot, { HotspotScope } from '../../../domain/model/Hotspot';
import MediaHotspot from '../../../domain/model/MediaHotspot';
import Cityzen from '../../../domain/model/Cityzen';
import CityzenId from '../../../domain/model/CityzenId';

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
                return author.isEqual(hotspot.author);
            });
            this.filteredHotspotCollections = new Set([
                ...this.filteredHotspotCollections,
                ...new Set(hotspotOwnerShip),
            ]);
        }
        return this;
    };

    public pickHotspotMemberShip = (cityzenId: CityzenId): HotspotReducer => {
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

    public renderVisibleHotspotsByVisitorStatus = (cityzenAuthenticated?: Cityzen): Hotspot[] => {
        this.pickPublicHotspot();
        if (cityzenAuthenticated) {
            if (cityzenAuthenticated.isAdmin) return this.hotspotCollection;

            this.pickHotspotMemberShip(cityzenAuthenticated.id);
            this.pickHotspotOwnerShip(
                new Author(
                    cityzenAuthenticated.pseudo,
                    cityzenAuthenticated.id,
                    cityzenAuthenticated.pictureExtern,
                    cityzenAuthenticated.pictureCityzen,
                ),
            );
        }
        return this.releaseFilteredHotspots();
    };
}

export default HotspotReducer;
