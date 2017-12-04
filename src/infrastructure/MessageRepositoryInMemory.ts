import MessageFactory from './MessageFactory';
import Message from '../domain/cityLife/model/messages/Message';
import HotspotId from '../domain/cityLife/model/hotspot/HotspotId';
import orm from './orm';
import IMessageRepository from 'src/domain/cityLife/model/messages/IMessageRepository';

class MessageRepositoryInMemory implements IMessageRepository{

    protected orm : any;
    protected messageFactory: MessageFactory;

    constructor(orm : any, messageFactory: MessageFactory) {
        this.orm = orm;
        this.messageFactory = messageFactory;
    }

    public findByHotspotId(id: string): Message[] {
        const hotspotId = new HotspotId(id);
        const data = this.orm.message.findAll({ hotspotId: hotspotId.id });
        return data.map((messageEntry : any) => this.messageFactory.createMessage(messageEntry));
    }

    public findById(id: string): Message {
        const entry = this.orm.message.findOne({ id, removed: false });
        if (!entry) return;
        const message = this.messageFactory.createMessage(entry);
        return message;
    }

    public isSet(id: string): boolean {
        const data = this.orm.message.findOne({ id });
        return !!data;
    }

    public store(message: Message): void {
        this.orm.message.save(JSON.parse(JSON.stringify(message)));
    }

    public update(message: Message): void {
        this.orm.message.update(JSON.parse(JSON.stringify(message)));
    }

    public delete(id: string): void {
        this.orm.message.delete(id);
    }
}
const messageRepositoryInMemory: MessageRepositoryInMemory =
new MessageRepositoryInMemory(orm, new MessageFactory());

export { MessageRepositoryInMemory };
export default messageRepositoryInMemory;
