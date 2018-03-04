import HotspotId from '../domain/cityLife/model/hotspot/HotspotId';
import Author from '../domain/cityLife/model/author/Author';
import Message from '../domain/cityLife/model/messages/Message';
import { v4 } from 'uuid';

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
            author = new Author(data.author.pseudo, data.author.id);
        }
        // data coming from the api user
        if (data.cityzen) {
            author = new Author(data.cityzen.pseudo, data.cityzen.id);
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
