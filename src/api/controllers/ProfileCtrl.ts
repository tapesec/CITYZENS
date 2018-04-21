import { OK } from 'http-status-codes';
import * as rest from 'restify';
import Auth0Service from 'src/api/services/auth/Auth0Service';
import Cityzen from '../../domain/cityzens/model/Cityzen';
import CityzenRepositoryPostgreSQL from '../../infrastructure/CityzenRepositoryPostgreSQL';
import HotspotRepositoryInMemory from '../../infrastructure/HotspotRepositoryInMemory';
import cityzenFromAuth0 from '../services/cityzen/cityzenFromAuth0';
import ErrorHandler from '../services/errors/ErrorHandler';
import { Auth0 } from './../libs/Auth0';
import RootCtrl from './RootCtrl';

class ProfileCtrl extends RootCtrl {
    protected cityzenRepository: CityzenRepositoryPostgreSQL;
    protected hotspotRepository: HotspotRepositoryInMemory;
    protected auth0Sdk: Auth0;
    public static UPDATE_PROFILE_ERROR = 'Failed to update profile';
    public static FIND_HOTSPOT_ERROR = "Can't access hotspots data";
    public static REFRESH_TOKEN_REQUIRED_ERROR = 'refresh token required';
    public static HOTSPOT_NOT_FOUND = 'hotspot not found';

    constructor(
        errorHandler: ErrorHandler,
        auth0Service: Auth0Service,
        cityzenRepository: CityzenRepositoryPostgreSQL,
        auth0Sdk: Auth0,
        hotspotRepositoryInMemory: HotspotRepositoryInMemory,
    ) {
        super(errorHandler, auth0Service);
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
            return next(this.errorHandler.logAndCreateInternal(`POST ${req.path()}`, err));
        }
        try {
            const currentCityzen: Cityzen = cityzenFromAuth0(this.userInfo);
            currentCityzen.addHotspotAsFavorit(favoritId);
            await this.cityzenRepository.updateFavoritesHotspots(
                Array.from(currentCityzen.favoritesHotspots),
                currentCityzen.id,
            );
            const renewedTokens = await this.auth0Sdk.getAuthenticationRefreshToken(refreshToken);
            res.json(OK, renewedTokens);
        } catch (err) {
            return next(this.errorHandler.logAndCreateInternal(`POST ${req.path()}`, err));
        }
    };
}

export default ProfileCtrl;
