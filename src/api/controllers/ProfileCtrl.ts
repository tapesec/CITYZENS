import { Auth0 } from './../libs/Auth0';
import Cityzen from '../../domain/cityzens/model/Cityzen';
import { CityzenAuth0Repository } from '../../infrastructure/CityzenAuth0Repository';
import RootCtrl from './RootCtrl';
import * as rest from 'restify';
import { OK } from 'http-status-codes';
import HotspotRepositoryInMemory from '../../infrastructure/HotspotRepositoryInMemory';
import ErrorHandler from '../services/errors/ErrorHandler';
import cityzenFromAuth0 from '../services/cityzen/cityzenFromAuth0';
import Login from '../services/auth/Login';

class ProfileCtrl extends RootCtrl {
    protected cityzenRepository: CityzenAuth0Repository;
    protected hotspotRepository: HotspotRepositoryInMemory;
    protected auth0Sdk: Auth0;
    public static UPDATE_PROFILE_ERROR = 'Failed to update profile';
    public static FIND_HOTSPOT_ERROR = "Can't access hotspots data";
    public static REFRESH_TOKEN_REQUIRED_ERROR = 'refresh token required';
    public static HOTSPOT_NOT_FOUND = 'hotspot not found';

    constructor(
        errorHandler: ErrorHandler,
        loginService: Login,
        cityzenRepository: CityzenAuth0Repository,
        auth0Sdk: Auth0,
        hotspotRepositoryInMemory: HotspotRepositoryInMemory,
    ) {
        super(errorHandler, loginService);
        this.cityzenRepository = cityzenRepository;
        this.auth0Sdk = auth0Sdk;
        this.hotspotRepository = hotspotRepositoryInMemory;
    }

    // POST/profiles/favorites/:favoriteId
    public postFavorit = async (req: rest.Request, res: rest.Response, next: rest.Next) => {
        const favoritId = req.params.favoritHotspotId;
        const refreshToken = req.query.refresh_token;

        if (!refreshToken) {
            return next(
                this.errorHandler.logAndCreateBadRequest(
                    `POST ${req.path()}`,
                    ProfileCtrl.REFRESH_TOKEN_REQUIRED_ERROR,
                ),
            );
        }
        try {
            const hotspot = this.hotspotRepository.findById(favoritId);
            if (!hotspot) {
                return next(
                    this.errorHandler.logAndCreateNotFound(
                        `POST ${req.path()}`,
                        ProfileCtrl.HOTSPOT_NOT_FOUND,
                    ),
                );
            }
        } catch (err) {
            return next(this.errorHandler.logAndCreateInternal(`POST ${req.path()}`, err.message));
        }
        try {
            const currentCityzen: Cityzen = cityzenFromAuth0(this.userInfo);
            currentCityzen.addHotspotAsFavorit(favoritId);
            await this.cityzenRepository.updateFavoritesHotspots(currentCityzen);
            const renewedTokens = await this.auth0Sdk.getAuthenticationRefreshToken(refreshToken);
            res.json(OK, renewedTokens);
        } catch (err) {
            return next(this.errorHandler.logAndCreateInternal(`POST ${req.path()}`, err.message));
        }
    };
}

export default ProfileCtrl;
