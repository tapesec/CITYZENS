import Message from './Message';
import HotspotId from '../hotspot/HotspotId';

export default interface IMessageRepository {

    findByHotspotId(id: string): Message[];

    findById(id: string): Message;

    store(message: Message): void;

    isSet(id: string): boolean;

    update(message: Message): void;

    delete(id: string): void;
}
