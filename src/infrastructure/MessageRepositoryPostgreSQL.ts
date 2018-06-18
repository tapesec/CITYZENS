import IMessageRepository from 'src/domain/cityLife/model/messages/IMessageRepository';
import HotspotId from '../domain/cityLife/model/hotspot/HotspotId';
import Message from '../domain/cityLife/model/messages/Message';
import MessageId from '../domain/cityLife/model/messages/MessageId';
import MessageFactory from './MessageFactory';
import OrmMessage from './ormMessage';

class MessageRepositoryInMemory implements IMessageRepository {
    protected ormMessage: OrmMessage;
    protected messageFactory: MessageFactory;

    constructor(ormMessage: OrmMessage, messageFactory: MessageFactory) {
        this.ormMessage = ormMessage;
        this.messageFactory = messageFactory;
    }

    public async findByHotspotId(id: HotspotId): Promise<Message[]> {
        const data = await this.ormMessage.findAll(id);
        return data.map((messageEntry: any) => this.messageFactory.createMessage(messageEntry));
    }

    public async findById(id: MessageId): Promise<Message> {
        const entry = await this.ormMessage.findOne(id);
        if (!entry) return;
        const message = this.messageFactory.createMessage(entry);
        return message;
    }

    public async isSet(id: MessageId): Promise<boolean> {
        const data = await this.ormMessage.findOne(id);
        return !!data;
    }

    public store(message: Message) {
        this.ormMessage.save(message);
    }

    public update(message: Message) {
        this.ormMessage.update(message);
    }

    public delete(id: MessageId) {
        this.ormMessage.delete(id);
    }
}

export default MessageRepositoryInMemory;
