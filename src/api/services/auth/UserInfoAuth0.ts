import Cityzen from '../../../domain/cityzens/model/Cityzen';

class UserInfoAuth0 {

    public sub: string;
    public nickname: string;
    public name: string;
    public picture: string;
    public updateAt: string;
    public email: string;
    public email_verified: boolean;

    public createCityzen() : Cityzen {
        let id: string;
        let email: string;
        let pseudo: string;
    
        if (this.sub) id = this.sub;
        else throw new Error('no subject found in auth0\'s userInfo');
        if (this.email) email = this.email;
        else throw new Error('no email found in auth0\'s userInfo');
        if (this.nickname) pseudo = this.nickname;
        else throw new Error('no nickname found in auth0\'s userInfo');
    
        const cityzen = new Cityzen(
            id, email, pseudo,
        );
    
        return cityzen;
    }
}

export default UserInfoAuth0;
