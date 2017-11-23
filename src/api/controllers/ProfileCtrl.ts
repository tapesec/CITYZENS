import { Auth0 } from './../libs/Auth0';

import Cityzen from '../../domain/cityzens/model/Cityzen';
import { CityzenAuth0Repository } from '../../infrastructure/CityzenAuth0Repository';
import JwtParser from '../services/auth/JwtParser';
import RootCtrl from './RootCtrl';
import * as rest from 'restify';
import * as restifyErrors from 'restify-errors';
import { OK } from 'http-status-codes';


class ProfileCtrl extends RootCtrl {

    protected cityzenRepository : CityzenAuth0Repository;
    protected auth0Sdk : Auth0;
    public static UPDATE_PROFILE_ERROR = 'Failed to update profile';
    public static REFRESH_TOKEN_REQUIRED_ERROR = 'refresh token required';

    constructor(
        jwtParser : JwtParser,
        cityzenRepository: CityzenAuth0Repository,
        auth0Sdk : Auth0,
    ) {
        super(jwtParser);
        this.cityzenRepository = cityzenRepository;
        this.auth0Sdk = auth0Sdk;
    }

    public postFavorit = async (req : rest.Request, res : rest.Response, next : rest.Next) => {
        if (!req.query.refresh_token) {
            return next(
                new restifyErrors.BadRequestError(ProfileCtrl.REFRESH_TOKEN_REQUIRED_ERROR),
            );
        }
        const refreshToken = req.query.refresh_token;
        const favoritId = req.params.favoritHotspotId;
        const id = this.decodeJwtPayload.sub;
        const email = this.decodeJwtPayload.email;
        const nickname = this.decodeJwtPayload.nickname;
        const description = this.decodeJwtPayload.userMetadata.description;
        const currentCityzen = new Cityzen(id, email, nickname, description);
        currentCityzen.addHotspotAsFavorit(favoritId);
        try {
            await this.cityzenRepository.updateFavoritsHotspots(currentCityzen);
            const token = await this.auth0Sdk.getAuthenticationRefreshToken(refreshToken);
            res.json(OK, { newToken: token });
        } catch (err) {
            return next(new restifyErrors.InternalServerError(ProfileCtrl.UPDATE_PROFILE_ERROR));
        }
    }
}

export default ProfileCtrl;
