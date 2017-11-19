import Cityzen from '../../domain/cityzens/model/Cityzen';
import { CityzenAuth0Repository } from '../../infrastructure/CityzenAuth0Repository';
import JwtParser from '../services/auth/JwtParser';
import RootCtrl from './RootCtrl';
import * as rest from 'restify';
import * as restifyErrors from 'restify-errors';
import { getStatusText, OK } from 'http-status-codes';

class ProfileCtrl extends RootCtrl {

    protected cityzenRepository : CityzenAuth0Repository;
    public static UPDATE_PROFILE_ERROR = 'Failed to update profile';
    
    constructor(jwtParser : JwtParser, cityzenRepository: CityzenAuth0Repository) {
        super(jwtParser);
        this.cityzenRepository = cityzenRepository;
    }

    public postFavorit = async (req : rest.Request, res : rest.Response, next : rest.Next) => { 
        const favoritId = req.params.favoritHotspotId;
        const id = this.decodeJwtPayload.sub;
        const email = this.decodeJwtPayload.email;
        const nickname = this.decodeJwtPayload.nickname;
        const description = this.decodeJwtPayload.userMetadata.description;
        const currentCityzen = new Cityzen(id, email, nickname, description);
        currentCityzen.addHotspotAsFavorit(favoritId);
        try {
            await this.cityzenRepository.updateFavoritsHotspots(currentCityzen);
            res.json(OK, getStatusText(OK));
        } catch (err) {
            return next(new restifyErrors.InternalServerError(ProfileCtrl.UPDATE_PROFILE_ERROR));
        }
    }
}

export default ProfileCtrl;
