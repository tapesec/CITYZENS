class AuthentificationError extends Error {
    constructor(private _err: string, m: string, private _access_token: string) {
        super(m);

        Object.setPrototypeOf(this, AuthentificationError.prototype);
    }

    public get access_token() : string {
        return this._access_token;
    }
    public get err(): string {
        return this._err;
    }
}

export default AuthentificationError;
