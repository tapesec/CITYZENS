import PostgreSQL from '../api/services/postgreSQL/postgreSQL';
import HotspotId from '../domain/cityLife/model/hotspot/HotspotId';
import Message from '../domain/cityLife/model/messages/Message';
import MessageId from '../domain/cityLife/model/messages/MessageId';

export default class OrmMessage {
    constructor(private postgre: PostgreSQL) {}

    private constructFromQueryResult(entry: any) {
        const author = {
            pseudo: entry['pseudo'],
            id: entry['user_id'],
            pictureExtern: entry['picture_extern'],
            pictureCityzen: entry['picture_cityzen'],
        };
        const message = {
            author,
            id: entry.id,
            title: entry['title'],
            body: entry['body'],
            pinned: entry['pinned'],
            hotspotId: entry['hotspot_id'],
            createdAt: entry['created_at'],
            updateAt: entry['updated_at'],
            parentId: entry['parent_id'] === null ? undefined : entry['parent_id'],
        };
        return message;
    }

    public async countAllComments(ids: MessageId[]) {
        // Match parent_id with the number of times there are mentionned
        const query = `
            SELECT parent_id, count(id) AS count FROM messages
            WHERE parent_id IN (
                ${ids.map((x, i) => `$${i + 1}`).join(',')}) AND removed = false GROUP BY parent_id
        `;
        const values = ids.map(x => x.toString());
        const results = await this.postgre.query(query, values);

        return results.rows;
    }

    public async findAll(hotspotId: HotspotId) {
        const query = `
            SELECT * from messages m JOIN cityzens c ON m.author_id = c.user_id
            WHERE hotspot_id = $1 AND parent_id = 'null' AND removed = false
        `;
        const values = [hotspotId.toString()];

        const result = await this.postgre.query(query, values);

        const messages = [];
        for (const entry of result.rows) {
            messages.push(this.constructFromQueryResult(entry));
        }
        return messages;
    }
    public async findComments(messageId: MessageId) {
        const query = `
            SELECT * from messages m JOIN cityzens c ON m.author_id = c.user_id
            WHERE parent_id = $1 AND removed = false
        `;
        const values = [messageId.toString()];

        const result = await this.postgre.query(query, values);

        const messages = [];
        for (const entry of result.rows) {
            messages.push(this.constructFromQueryResult(entry));
        }
        return messages;
    }
    public async findOne(messageId: MessageId) {
        const query = `
            SELECT * from messages m JOIN cityzens c ON m.author_id = c.user_id
            WHERE id = $1 AND removed = false
        `;
        const values = [messageId.toString()];

        const result = await this.postgre.query(query, values);

        if (result.rowCount < 1) {
            return;
        }
        const entry = result.rows[0];

        return this.constructFromQueryResult(entry);
    }
    public async save(message: Message) {
        const query = `
            INSERT INTO messages (id, author_id, hotspot_id, title, body, pinned, created_at, updated_at, parent_id)
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
        `;
        const values = [
            message.id.toString(),
            message.author.id.toString(),
            message.hotspotId.toString(),
            message.title,
            message.body,
            message.pinned,
            message.createdAt.toUTCString(),
            message.updatedAt.toUTCString(),
            message.parentId === undefined ? 'null' : message.parentId.toString(),
        ];

        await this.postgre.query(query, values);
    }
    public async update(message: Message) {
        const query = 'UPDATE messages SET title = $1, body = $2, pinned = $3 WHERE id = $4';
        const values = [
            message.title.toString(),
            message.body.toString(),
            message.pinned,
            message.id.toString(),
        ];

        await this.postgre.query(query, values);
    }
    public async delete(id: MessageId) {
        const query = 'UPDATE messages SET removed = true WHERE id = $1 OR parent_id = $1';
        const values = [id.toString()];

        await this.postgre.query(query, values);
    }
}
