import MessageFactory from '../../infrastructure/MessageFactory';
import HotspotId from '../../domain/cityLife/model/hotspot/HotspotId';
import Message from './../../domain/cityLife/model/messages/Message';
import
messageRepositoryInMemory,
{ MessageRepositoryInMemory } from '../../infrastructure/MessageRepositoryInMemory';
import { HotspotRepositoryInMemory } from '../../infrastructure/HotspotRepositoryInMemory';
import JwtParser from '../services/auth/JwtParser';
import RootCtrl from './RootCtrl';
import { createMessageSchema, patchMessageSchema } from '../requestValidation/schema';
import * as rest from 'restify';
import { OK, NOT_FOUND, getStatusText, INTERNAL_SERVER_ERROR, CREATED } from 'http-status-codes';
import * as restifyErrors from 'restify-errors';
import ErrorHandler from '../services/errors/ErrorHandler';
import cityzenFromAuth0 from '../services/cityzen/cityzenFromAuth0';

class MessageCtrl extends RootCtrl​​ {

    private hotspotRepository: HotspotRepositoryInMemory;
    private messageRepository: MessageRepositoryInMemory;
    private messageFactory: MessageFactory;
    private static HOTSPOT_NOT_FOUND = 'Hotspot not found';
    private static MESSAGE_NOT_FOUND = 'Message not found';

    constructor (
        errorHandler: ErrorHandler,
        request : any,
        hotspotRepositoryInMemory: HotspotRepositoryInMemory,
        messageRepositoryInMemory: MessageRepositoryInMemory,
        messageFactory: MessageFactory,
    ) {
        super(errorHandler, request);
        this.hotspotRepository = hotspotRepositoryInMemory;
        this.messageRepository = messageRepositoryInMemory;
        this.messageFactory = messageFactory;
    }

    // method=GET url=/hotspots/{hotspotId}/messages
    public getMessages = (req : rest.Request, res : rest.Response, next : rest.Next)  => {
        if (!this.hotspotRepository.isSet(req.params.hotspotId)) {
            return next(
                this.errorHandler.logAndCreateNotFound(`GET ${req.path()}`),
            );
        }
        try {
            const hotspotContent: Message[] =
            this.messageRepository.findByHotspotId(req.params.hotspotId);
            res.json(OK, hotspotContent);
        } catch (err) {
            return next(
                this.errorHandler.logAndCreateInternal(`GET ${req.path()}`, err.message),
            );
        }
    }

    // method=POST url=/hotspots/{hotspotId}/messages
    public postMessage = async (req : rest.Request, res : rest.Response, next : rest.Next) => {
        if (!this.schemaValidator.validate(createMessageSchema, req.body))
            return next(this.errorHandler.logAndCreateBadRequest(
                `POST ${req.path()}`, this.schemaValidator.errorsText(),
            ));
        if (!this.hotspotRepository.isSet(req.params.hotspotId)) {
            return next(this.errorHandler.logAndCreateNotFound(
                `POST ${req.path()}`, MessageCtrl.HOTSPOT_NOT_FOUND,
            ));
        }

        req.body.hotspotId = req.params.hotspotId;
        try {
            req.body.cityzen = cityzenFromAuth0(await this.userInfo);
            const newMessage = this.messageFactory.createMessage(req.body);
            this.messageRepository.store(newMessage);
            res.json(CREATED, newMessage);
        } catch (err) {
            return next(
                this.errorHandler.logAndCreateInternal(`POST ${req.path()}`, err.message),
            );
        }
    }

    // method=PATCH url=/hotspots/{hotspotId}/messages/{messageId}
    public patchMessage = (req: rest.Request, res: rest.Response, next: rest.Next) => {
        let message: Message;

        if (!this.schemaValidator.validate(patchMessageSchema, req.body))
            return next(this.errorHandler.logAndCreateBadRequest(
                `PATCH ${req.path()}`, this.schemaValidator.errorsText(),
            ));
        try {
            message = this.messageRepository.findById(req.params.messageId);
        } catch (err) {
            return next(this.errorHandler.logAndCreateInternal(`PATCH ${req.path()}`, err.message));
        }
        if (!message) {
            return next(this.errorHandler.logAndCreateNotFound(
                `PATCH ${req.path()}`, MessageCtrl.MESSAGE_NOT_FOUND,
            ));
        }
        // TODO encapsuler la logique suivante
        try {
            if (req.body.title) {
                message.changeTitle(req.body.title);
            }
            if (req.body.body) {
                message.editBody(req.body.body);
            }
            if (req.body.pinned !== undefined) {
                if (message.pinned !== req.body.pinned) message.togglePinMode();
            }
            this.messageRepository.update(message);
        } catch (err) {
            return next(
                this.errorHandler.logAndCreateInternal(`PATCH ${req.path()}`, err.message),
            );
        }
        res.json(OK, message);
    }

    // method=DELETE url=/hotspots/{hotspotId}/messages/{messageId}
    public removeMessage = (req: rest.Request, res: rest.Response, next: rest.Next) => {

        if (!this.messageRepository.isSet(req.params.messageId)) {
            return next(this.errorHandler.logAndCreateNotFound(
                `DELETE ${req.path()}`, MessageCtrl.MESSAGE_NOT_FOUND,
            ));
        }
        try {
            this.messageRepository.delete(req.params.messageId);
        } catch (err) {
            return next(
                this.errorHandler.logAndCreateInternal(`DELETE ${req.path()}`, err.message),
            );
        }
        res.json(OK, getStatusText(OK));
    }
}
export default MessageCtrl;
