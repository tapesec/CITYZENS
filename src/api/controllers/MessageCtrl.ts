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
import { createMessageSchema } from '../requestValidation/schema';
import * as rest from 'restify';
const logs = require('./../../logs/');
const httpResponseDataLogger = logs.get('http-response-data');
import { OK, NOT_FOUND, getStatusText, INTERNAL_SERVER_ERROR, CREATED } from 'http-status-codes';
import * as restifyErrors from 'restify-errors';

class MessageCtrl extends RootCtrl​​ {

    private hotspotRepository: HotspotRepositoryInMemory;
    private messageRepository: MessageRepositoryInMemory;
    private messageFactory: MessageFactory;
    private static HOTSPOT_NOT_FOUND = 'Hotspot not found';
    private static MESSAGE_NOT_FOUND = 'Message not found';

    constructor (
        jwtParser : JwtParser,
        hotspotRepositoryInMemory: HotspotRepositoryInMemory,
        messageRepositoryInMemory: MessageRepositoryInMemory,
        messageFactory: MessageFactory,
    ) {
        super(jwtParser);
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
            httpResponseDataLogger.info(err.message);
            return next(
                new restifyErrors.InternalServerError(getStatusText(INTERNAL_SERVER_ERROR)));
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
            httpResponseDataLogger.info(err.message);
            return next(
                new restifyErrors.InternalServerError(getStatusText(INTERNAL_SERVER_ERROR)));
        }
    }

    // method=PATCH url=/hotspots/{hotspotId}/messages/{messageId}
    public patchMessage = (req: rest.Request, res: rest.Response, next: rest.Next) => {
        let message: Message;

        if (!this.schemaValidator.validate(createMessageSchema, req.body))
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
            if (req.body.messageBody) {
                message.editBody(req.body.messageBody);
            }
            if (req.body.pinned !== undefined) {
                if (message.pinned !== req.body.pinned) message.togglePinMode();
            }
            this.messageRepository.update(message);
        } catch (err) {
            return next(new restifyErrors.InternalServerError(err.message));
        }
        res.json(OK, message);
    }

    public removeMessage = (req: rest.Request, res: rest.Response, next: rest.Next) => {

        if (!this.messageRepository.isSet(req.params.messageId)) {
            return next(new restifyErrors.NotFoundError(MessageCtrl.MESSAGE_NOT_FOUND));
        }
        try {
            this.messageRepository.delete(req.params.messageId);
        } catch (err) {
            return next(new restifyErrors.InternalServerError(err.message));
        }
        res.json(OK, getStatusText(OK));
    }
}
export default MessageCtrl;
