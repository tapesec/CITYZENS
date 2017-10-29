import Position from './Position';
import Content from './Content';
import Author from './Author';

class Hotspot {

    protected _uid : string;
    protected _position : Position;
    protected _title : string;
    protected _content : Content;
    protected _author : Author;

    constructor(
        id : string,
        title : string,
        position : Position,
        content : Content,
        author : Author,
    ) {
        this._uid = id;
        this._title = title;
        this._position = position;
        this._content = content;
        this._author = author;
    }
    get id() : string {
        return this._uid;
    }

    get position() : Position {
        return this._position;
    }

    get title() : string {
        return this._title;
    }

    get content() : Content {
        return this._content;
    }

    get author() : Author {
        return this._author;
    }

    moveTo(newLat : number, newLng : number) : void {
        this._position = new Position(newLat, newLng);
    }

    editMessage(message : string) : void {
        this._content = new Content(message, this._content.createdAt, new Date());
    }

    changeTitle(title : string) : void {
        this._title = title;
    }

    toJSON() {
        return {
            id: this.id,
            title: this.title,
            position: this.position,
            content: this.content,
            author: this.author,
        };
    }
}

export default Hotspot;
