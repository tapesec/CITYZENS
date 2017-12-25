import MessageFactory from '../../infrastructure/MessageFactory';
import HotspotId from '../../domain/cityLife/model/hotspot/HotspotId';
import Message from './../../domain/cityLife/model/messages/Message';
import cityzenFromJwt from '../services/cityzen/cityzenFromJwt';
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
import ErrorHandler from 'src/api/services/errors/ErrorHandler';

class MessageCtrl extends RootCtrl​​ {

    private hotspotRepository: HotspotRepositoryInMemory;
    private messageRepository: MessageRepositoryInMemory;
    private messageFactory: MessageFactory;
    private static HOTSPOT_NOT_FOUND = 'Hotspot not found';
    private static MESSAGE_NOT_FOUND = 'Message not found';

    constructor (
        errorHandler: ErrorHandler,
        jwtParser : JwtParser,
        hotspotRepositoryInMemory: HotspotRepositoryInMemory,
        messageRepositoryInMemory: MessageRepositoryInMemory,
        messageFactory: MessageFactory,
    ) {
        super(errorHandler, jwtParser);
        this.hotspotRepository = hotspotRepositoryInMemory;
        this.messageRepository = messageRepositoryInMemory;
        this.messageFactory = messageFactory;
    }

    // method=GET url=/hotspots/{hotspotId}/messages
    public getMessages = (req : rest.Request, res : rest.Response, next : rest.Next)  => {
        if (!this.hotspotRepository.isSet(req.params.hotspotId)) {
            return next(new restifyErrors.NotFoundError(getStatusText(NOT_FOUND)));
        }
        try {
            const hotspotContent: Message[] =
            this.messageRepository.findByHotspotId(req.params.hotspotId);
            res.json(OK, hotspotContent);
        } catch (err) {
            return this.errorHandler.logInternal(err.message, `GET ${req.path()}`, next);
        }
    }

    // method=POST url=/hotspots/{hotspotId}/messages
    public postMessage = (req : rest.Request, res : rest.Response, next : rest.Next) => {
        if (!this.schemaValidator.validate(createMessageSchema, req.body))
            return next(new restifyErrors.BadRequestError(this.schemaValidator.errorsText()));
        if (!this.hotspotRepository.isSet(req.params.hotspotId)) {
            return next(new restifyErrors.NotFoundError(MessageCtrl.HOTSPOT_NOT_FOUND));
        }

        req.body.hotspotId = req.params.hotspotId;
        try {
            req.body.cityzen = cityzenFromJwt(this.decodedJwtPayload);
            const newMessage = this.messageFactory.createMessage(req.body);
            this.messageRepository.store(newMessage);
            res.json(CREATED, newMessage);
        } catch (err) {
            return this.errorHandler.logInternal(err.message, `POST ${req.path()}`, next);
        }
    }

    // method=PATCH url=/hotspots/{hotspotId}/messages/{messageId}
    public patchMessage = (req: rest.Request, res: rest.Response, next: rest.Next) => {
        let message: Message;

        if (!this.schemaValidator.validate(patchMessageSchema, req.body))
            return next(new restifyErrors.BadRequestError(this.schemaValidator.errorsText()));
        try {
            message = this.messageRepository.findById(req.params.messageId);
        } catch (err) {
            return next(new restifyErrors.InternalServerError(err.message));
        }
        if (!message) {
            return next(new restifyErrors.NotFoundError(MessageCtrl.MESSAGE_NOT_FOUND));
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
            return this.errorHandler.logInternal(err.message, `PATCH ${req.path()}`, next);
        }
        res.json(OK, message);
    }

    // method=DELETE url=/hotspots/{hotspotId}/messages/{messageId}
    public removeMessage = (req: rest.Request, res: rest.Response, next: rest.Next) => {

        if (!this.messageRepository.isSet(req.params.messageId)) {
            return next(new restifyErrors.NotFoundError(MessageCtrl.MESSAGE_NOT_FOUND));
        }
        try {
            this.messageRepository.delete(req.params.messageId);
        } catch (err) {
            return this.errorHandler.logInternal(err.message, `DELETE ${req.path()}`, next);
        }
        res.json(OK, getStatusText(OK));
    }
}
export default MessageCtrl;
