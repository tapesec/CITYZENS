
interface Position {
    latitude: number;
    longitude: number;
}

class Hotspot {

    protected uid: string;
    protected coords: Position;

    constructor(id: string, position: Position) {
        this.uid = id;
        this.coords = position;
    }
    get id() : string {
        return this.uid;
    }

    get position() : Position {
        return this.coords;
    }

    toJSON() {
        return {
            position: this.coords,
            id: this.uid,
        };
    }
}

export default Hotspot;
