class UserInfoAuth0 {
    private _sub: string;
    private _nickname: string;
    private _name: string;
    private _pictureCityzen: string;
    private _pictureExtern: string;
    private _updateAt: string;
    private _email: string;
    private _email_verified: boolean;
    private _user_metadata: any;
    private _app_metadata: any;
    private _isAdmin: boolean;

    constructor(userInfoRaw: string, private _accessToken: string) {
        const userInfo = JSON.parse(userInfoRaw);

        this._sub = userInfo.sub as string;
        this._nickname = userInfo.nickname as string;
        this._name = userInfo.name as string;
        this._email = userInfo.email as string;
        this._email_verified = userInfo.email_verified as boolean;
        this._user_metadata = userInfo['https://www.cityzen.fr/user_metadata'] as any;
        this._app_metadata = userInfo['https://www.cityzen.fr/app_metadata'] as any;
        this._updateAt = userInfo.updateAt as string;
        if (!this._user_metadata) return;

        this._isAdmin = this._user_metadata.isAdmin as boolean;
        this._pictureCityzen = this._user_metadata.pictureCityzen as string;
        this._pictureExtern = this._user_metadata.pictureExtern as string;
    }

    public get sub(): string {
        return this._sub;
    }

    public get nickname(): string {
        return this._nickname;
    }

    public get name(): string {
        return this._name;
    }

    public get pictureCityzen(): string {
        return this._pictureCityzen;
    }
    public get pictureExtern(): string {
        return this._pictureExtern;
    }

    public get updatedAt(): string {
        return this._updateAt;
    }

    public get email(): string {
        return this._email;
    }

    public get emailVerified(): boolean {
        return this._email_verified;
    }

    public get isAdmin(): boolean {
        return this._isAdmin;
    }

    public get userMetadata(): any {
        return this._user_metadata;
    }

    public get appMetadata(): any {
        return this._app_metadata;
    }

    public get accessToken(): string {
        return this._accessToken;
    }
}

export default UserInfoAuth0;
