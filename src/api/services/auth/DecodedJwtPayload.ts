
class DecodedJwtPayload {

    protected payload : any;
    protected payloadNamespace : string;
    
    constructor(tokenPayload : any, namespace : string) {
        this.payload = tokenPayload;
        this.payloadNamespace = namespace;
    }

    public get sub() : string {
        return this.payload.sub;
    }

    public get email() : string {
        return this.payload.email;
    }

    public get nickname() : string {
        return this.payload.nickname;
    }

    public get userMetadata() : any {
        return this.payload[this.payloadNamespace + '/user_metadata'];
    }
}

export default DecodedJwtPayload;
