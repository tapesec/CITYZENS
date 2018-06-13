import { v4 } from 'uuid';
import HotspotId from '../domain/cityLife/model/hotspot/HotspotId';
import ImageLocation from '../domain/cityLife/model/hotspot/ImageLocation';
import Message from '../domain/cityLife/model/messages/Message';
import CityzenId from '../domain/cityzens/model/CityzenId';
import Author from './../domain/cityLife/model/author/Author';

class MessageFactory {
    public createMessage = (data: any): Message => {
        let author: Author;
        let pinned: boolean;
        let hotspotId: HotspotId;
        let createdAt: Date;
        let updatedAt: Date;

        if (!data.id) {
            data.id = v4();
        }
        // data coming from database
        if (data.author) {
            const cityzenId = new CityzenId(data.author.id);
            const pictureCityzen = new ImageLocation(data.author.pictureCityzen);
            const pictureExtern = new ImageLocation(data.author.pictureExtern);
            author = new Author(data.author.pseudo, cityzenId, pictureExtern, pictureCityzen);
        }
        // data coming from the api user
        if (data.cityzen) {
            const cityzenId = new CityzenId(data.cityzen.id);
            const pictureCityzen = new ImageLocation(data.cityzen.pictureCityzen);
            const pictureExtern = new ImageLocation(data.cityzen.pictureExtern);
            author = new Author(data.cityzen.pseudo, cityzenId, pictureExtern, pictureCityzen);
        }

        if (data.pinned) {
            pinned = data.pinned;
        } else pinned = false;

        if (data.hotspotId) {
            hotspotId = new HotspotId(data.hotspotId);
        }

        if (data.createdAt) {
            createdAt = new Date(data.createdAt);
        } else createdAt = new Date();

        if (data.updatedAt) {
            updatedAt = new Date(data.updatedAt);
        }

        return new Message(
            data.id,
            data.title,
            data.body,
            author,
            pinned,
            hotspotId,
            createdAt,
            updatedAt,
        );
    };
}
export default MessageFactory;
