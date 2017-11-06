import Cityzen from '../../../domain/cityzens/model/Cityzen';

class AuthorizedCityzen {
    protected payload : any; 

    constructor(tokenPayload : any) {
        this.payload = tokenPayload;
    }

    public load = () : Cityzen => {
        return new Cityzen(this.payload.email, this.payload.nickname);
    }
}

export default AuthorizedCityzen;
