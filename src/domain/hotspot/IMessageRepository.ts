import HotspotId from './HotspotId';
import Message from './Message';
import MessageId from './MessageId';

export default interface IMessageRepository {
    findByHotspotId(id: HotspotId): Promise<Message[]>;

    findById(id: MessageId): Promise<Message>;

    findComments(id: MessageId): Promise<Message[]>;

    store(message: Message): void;

    isSet(id: MessageId): Promise<boolean>;

    update(message: Message): void;

    delete(id: MessageId): void;
};
