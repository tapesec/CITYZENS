import IMessageRepository from '../application/domain/hotspot/IMessageRepository';
import HotspotId from '../application/domain/hotspot/HotspotId';
import Message from '../application/domain/hotspot/Message';
import MessageId from '../application/domain/hotspot/MessageId';
import MessageFactory from '../application/domain/hotspot/MessageFactory';
import OrmMessage from './ormMessage';

class MessageRepositoryPostgreSql implements IMessageRepository {
    protected ormMessage: OrmMessage;
    protected messageFactory: MessageFactory;

    constructor(ormMessage: OrmMessage, messageFactory: MessageFactory) {
        this.ormMessage = ormMessage;
        this.messageFactory = messageFactory;
    }

    public async getCommentsCount(ids: MessageId[]): Promise<{ [s: string]: number }> {
        const results = await this.ormMessage.countAllComments(ids);

        const commentCountJson: { [s: string]: number } = {};

        for (const entry of results) {
            const messageId = new MessageId(entry['parent_id']);
            const count = parseInt(entry['count'], 10);
            commentCountJson[messageId.toString()] = count;
        }
        return commentCountJson;
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

    public async findComments(id: MessageId): Promise<Message[]> {
        const entries = await this.ormMessage.findComments(id);
        const messages: Message[] = [];
        for (const entry of entries) {
            messages.push(this.messageFactory.createMessage(entry));
        }
        return messages;
    }

    public async isSet(id: MessageId): Promise<boolean> {
        const data = await this.ormMessage.findOne(id);
        return !!data;
    }

    public async store(message: Message) {
        await this.ormMessage.save(message);
    }

    public async update(message: Message) {
        await this.ormMessage.update(message);
    }

    public async delete(id: MessageId) {
        await this.ormMessage.delete(id);
    }
}

export default MessageRepositoryPostgreSql;
