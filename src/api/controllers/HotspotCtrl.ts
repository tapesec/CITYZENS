import AlertHotspot from '../../domain/cityLife/model/hotspot/AlertHotspot';
import EventHotspot from '../../domain/cityLife/model/hotspot/EventHotspot';
import WallHotspot from '../../domain/cityLife/model/hotspot/WallHotspot';
import cityzenFromJwt from '../services/cityzen/cityzenFromJwt';
import hotspotsByArea from '../services/hotspot/hotspotsByArea';
import Hotspot from '../../domain/cityLife/model/hotspot/Hotspot';
import hotspotsByCodeCommune from '../services/hotspot/hotspotsByCodeCommune';
import hotspotRepositoryInMemory, {
    HotspotRepositoryInMemory,
} from '../../infrastructure/HotspotRepositoryInMemory';
import JwtParser from '../services/auth/JwtParser';
import RootCtrl from './RootCtrl';
import * as rest from 'restify';
import { strToNumQSProps } from '../helpers/';
import { BAD_REQUEST, CREATED, OK, INTERNAL_SERVER_ERROR ,getStatusText } from 'http-status-codes';
import * as restifyErrors from 'restify-errors';
import HotspotFactory from '../../infrastructure/HotspotFactory';
import { getHotspots } from '../requestValidation/schema';
import createHotspotsSchema from '../requestValidation/createHotspotsSchema';
import patchHotspotsSchema from '../requestValidation/patchHotspotsSchema';
import config from '../config/index';
import actAsSpecified from '../services/hotspot/actAsSpecified';
import ErrorHandler from '../services/errors/ErrorHandler';
import UserInfoAuth0 from '../services/auth/UserInfoAuth0';
import Cityzen from '../../domain/cityzens/model/Cityzen';

class HotspotCtrl extends RootCtrl​​ {

    private hotspotRepository : HotspotRepositoryInMemory;
    private hotspotFactory : HotspotFactory;
    static BAD_REQUEST_MESSAGE = 'Invalid query strings';
    private static HOTSPOT_NOT_FOUND = 'Hotspot not found';

    constructor (
        errorHandler: ErrorHandler,
        request : any,
        hotspotRepositoryInMemory : HotspotRepositoryInMemory,
        hotspotFactory: HotspotFactory,
    ) {
        super(errorHandler, request);
        this.hotspotRepository = hotspotRepositoryInMemory;
        this.hotspotFactory = hotspotFactory;
    }

    // method=GET url=/hotspots
    public hotspots = (req : rest.Request, res : rest.Response, next : rest.Next)  => {

        const queryStrings: any = strToNumQSProps(req.query, ['north', 'east', 'west', 'south']);
        let hotspotsResult : Hotspot[];

        if (!this.schemaValidator.validate(getHotspots, queryStrings)) {
            return next(this.errorHandler.logAndCreateBadRequest(
                `GET ${req.path()}`, HotspotCtrl.BAD_REQUEST_MESSAGE,
            ));
        }
        try {
            if (queryStrings.north) {
                hotspotsResult = hotspotsByArea(queryStrings, this.hotspotRepository);
            } else if (queryStrings.insee) {
                hotspotsResult = hotspotsByCodeCommune(queryStrings.insee, this.hotspotRepository);
            }
        } catch (err) {
            return next(
                this.errorHandler.logAndCreateInternal(`GET ${req.path()}`, err.message),
            );
        }
        res.json(OK, hotspotsResult);
    }

    public createCityzen(usr: UserInfoAuth0) : Cityzen {
        let id: string;
        let email: string;
        let pseudo: string;
    
        if (usr.sub) id = usr.sub;
        else throw new Error('no subject found in auth0\'s userInfo');
        if (usr.email) email = usr.email;
        else throw new Error('no email found in auth0\'s userInfo');
        if (usr.nickname) pseudo = usr.nickname;
        else throw new Error('no nickname found in auth0\'s userInfo');
    
        const cityzen = new Cityzen(
            id, email, pseudo,
        );
    
        return cityzen;
    }

    // method=POST url=/hotspots
    public postHotspots = (req : rest.Request, res : rest.Response, next : rest.Next)  => {
        if (!this.schemaValidator.validate(createHotspotsSchema(), req.body)) {
            return next(this.errorHandler.logAndCreateBadRequest(
                `POST ${req.path()}`, this.schemaValidator.errorsText(),
            ));
        }

        try {
            req.body.cityzen = this.userInfo.createCityzen();   
            const newHotspot: Hotspot = this.hotspotFactory.build(req.body);
            this.hotspotRepository.store(newHotspot);
            res.json(CREATED, newHotspot);
        } catch (err) {
            return next(
                this.errorHandler.logAndCreateInternal(`POST ${req.path()}`, err.message),
            );
        }
    }

    // method= POST url=/hotspots/{hotspotId}/view
    public countView = (req : rest.Request, res : rest.Response, next : rest.Next)  => {
        if (!this.hotspotRepository.isSet(req.params.hotspotId)) {
            return next(this.errorHandler.logAndCreateNotFound(
                `POST view ${req.path()}`, HotspotCtrl.HOTSPOT_NOT_FOUND,
            ));
        }
        try {
            const visitedHotspot: Hotspot = this.hotspotRepository.findById(req.params.hotspotId);
            visitedHotspot.countOneMoreView();
            this.hotspotRepository.update(visitedHotspot);
            res.json(OK);
        } catch (err) {
            return next(
                this.errorHandler.logAndCreateInternal(`POST view ${req.path()}`, err.message),
            );
        }
    }

    // method=PATCH url=/hotspots/{hotspotId}
    public patchHotspots = (req : rest.Request, res : rest.Response, next : rest.Next)  => {
        if (!this.schemaValidator.validate(patchHotspotsSchema(), req.body))
            return next(this.errorHandler.logAndCreateBadRequest(
                `PATCH ${req.path()}`, this.schemaValidator.errorsText(),
            ));
        if (!this.hotspotRepository.isSet(req.params.hotspotId)) {
            return next(this.errorHandler.logAndCreateNotFound(
                `PATCH ${req.path()}`, HotspotCtrl.HOTSPOT_NOT_FOUND,
            ));
        }
        try {
            const hotspot: WallHotspot|EventHotspot|AlertHotspot =
            this.hotspotRepository.findById(req.params.hotspotId);

            /*
            *    Je ne suis pas sur que ça soit dans le scope de ma story de rajouter 
            *    les permissions d'edit/delete les hotspots.
            *    Je laisse ça ici pour montrer comment je le ferai si j'avais a le faire.
            
            if (hotspot.author.id !== this.userInfo.createCityzen().id) {
                return next(this.errorHandler.logAndCreateUnautorized(
                    `PATCH ${req.path()}`, 'You don\'t have permissions.',
                ));
            }
            */

            const hotspotToUpdate: Hotspot = actAsSpecified(hotspot, req.body);
            this.hotspotRepository.update(hotspotToUpdate);
            res.json(OK, hotspotToUpdate);
        } catch (err) {
            return next(
                this.errorHandler.logAndCreateInternal(`PATCH ${req.path()}`, err.message),
            );
        }
    }

    // method=DELETE url=/hotspots/{hotspotId}
    public removeHotspot = (req: rest.Request, res: rest.Response, next: rest.Next) => {

        if (!this.hotspotRepository.isSet(req.params.hotspotId)) {
            return next(this.errorHandler.logAndCreateNotFound(HotspotCtrl.HOTSPOT_NOT_FOUND));
        }
        try {
            this.hotspotRepository.remove(req.params.hotspotId);
        } catch (err) {
            return next(
                this.errorHandler.logAndCreateInternal(`DELETE ${req.path()}`, err.message),
            );
        }
        res.json(OK, getStatusText(OK));
    }
}

export default HotspotCtrl;
