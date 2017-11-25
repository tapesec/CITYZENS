import { Auth0 } from './../libs/Auth0';
import Cityzen from '../../domain/cityzens/model/Cityzen';
import { CityzenAuth0Repository } from '../../infrastructure/CityzenAuth0Repository';
import JwtParser from '../services/auth/JwtParser';
import RootCtrl from './RootCtrl';
import * as rest from 'restify';
import * as restifyErrors from 'restify-errors';
import { OK } from 'http-status-codes';
import cityzenFromJwt from '../../api/services/cityzen/cityzenFromJwt';
import { HotspotRepositoryInMemory } from '../../infrastructure/HotspotRepositoryInMemory';
const logs = require('./../../logs/');
const httpResponseDataLogger = logs.get('http-response-data');


class ProfileCtrl extends RootCtrl {

    protected cityzenRepository : CityzenAuth0Repository;
    protected hotspotRepository : HotspotRepositoryInMemory;
    protected auth0Sdk : Auth0;
    public static UPDATE_PROFILE_ERROR = 'Failed to update profile';
    public static FIND_HOTSPOT_ERROR = 'Can\'t access hotspots data';
    public static REFRESH_TOKEN_REQUIRED_ERROR = 'refresh token required';
    public static HOTSPOT_NOT_FOUND = 'hotspot not found';

    constructor(
        jwtParser : JwtParser,
        cityzenRepository: CityzenAuth0Repository,
        auth0Sdk : Auth0,
        hotspotRepositoryInMemory: HotspotRepositoryInMemory,
    ) {
        super(jwtParser);
        this.cityzenRepository = cityzenRepository;
        this.auth0Sdk = auth0Sdk;
        this.hotspotRepository = hotspotRepositoryInMemory;
    }

    public postFavorit = async (req : rest.Request, res : rest.Response, next : rest.Next) => {
        const favoritId = req.params.favoritHotspotId;
        const refreshToken = req.query.refresh_token;

        if (!refreshToken) {
            return next(
                new restifyErrors.BadRequestError(ProfileCtrl.REFRESH_TOKEN_REQUIRED_ERROR),
            );
        }
        try {
            const hotspot = this.hotspotRepository.findById(favoritId);
            if (!hotspot) {
                return next(
                    new restifyErrors.NotFoundError(ProfileCtrl.HOTSPOT_NOT_FOUND));
            }
        } catch (err) {
            return next(new restifyErrors.InternalServerError(ProfileCtrl.FIND_HOTSPOT_ERROR));
        }
        try {
            const currentCityzen : Cityzen = cityzenFromJwt(this.decodedJwtPayload);
            currentCityzen.addHotspotAsFavorit(favoritId);
            await this.cityzenRepository.updateFavoritesHotspots(currentCityzen);
            const renewedTokens = await this.auth0Sdk.getAuthenticationRefreshToken(refreshToken);
            res.json(OK, renewedTokens);
        } catch (err) {
            httpResponseDataLogger.info('Error when add a favorit hotspot', err);
            return next(new restifyErrors.InternalServerError(ProfileCtrl.UPDATE_PROFILE_ERROR));
        }
    }
}

export default ProfileCtrl;
