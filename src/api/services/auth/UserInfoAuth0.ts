
class UserInfoAuth0 {

    private _sub: string;
    private _nickname: string;
    private _name: string;
    private _picture: string;
    private _updateAt: string;
    private _email: string;
    private _email_verified: boolean;
    private _user_metadata: any;
    private _app_metadata: any;

    constructor(userInfoRaw: string) {
        const userInfo = JSON.parse(userInfoRaw);

        this._sub = userInfo.sub as string;
        this._nickname = userInfo.nickname as string;
        this._name = userInfo.name as string;
        this._picture = userInfo.picture as string;
        this._updateAt = userInfo.updateAt as string;
        this._email = userInfo.email as string;
        this._email_verified = userInfo.email_verified as boolean;
        this._user_metadata = userInfo['https://www.cityzen.fr/user_metadata'] as any;
        this._app_metadata = userInfo['https://www.cityzen.fr/app_metadata'] as any;
    }

    
    public get sub() : string {
        return this._sub;
    }

    public get nickname() : string {
        return this._nickname;
    }

    public get name() : string {
        return this._name;
    }
    
    public get picture() : string {
        return this._picture;
    }

    public get updatedAt() : string {
        return this._updateAt;
    }

    public get email() : string {
        return this._email;
    }

    public get emailVerified() : boolean {
        return this._email_verified;
    }
    
    public get userMetadata() : any {
        return this._user_metadata;
    }

    public get appMetadata() : any {
        return this._app_metadata;
    }
}

export default UserInfoAuth0;
