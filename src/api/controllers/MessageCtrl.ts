import { CREATED, getStatusText, OK } from 'http-status-codes';
import * as rest from 'restify';
import Auth0Service from 'src/api/services/auth/Auth0Service';
import HotspotId from '../../domain/cityLife/model/hotspot/HotspotId';
import MessageId from '../../domain/cityLife/model/messages/MessageId';
import HotspotRepositoryInMemory from '../../infrastructure/HotspotRepositoryPostgreSQL';
import MessageFactory from '../../infrastructure/MessageFactory';
import MessageRepositoryPostgreSql from '../../infrastructure/MessageRepositoryPostgreSQL';
import { createMessageSchema, patchMessageSchema } from '../requestValidation/schema';
import ErrorHandler from '../services/errors/ErrorHandler';
import * as isAuthorized from '../services/hotspot/isAuthorized';
import Message from './../../domain/cityLife/model/messages/Message';
import HotspotCtrl from './HotspotCtrl';
import RootCtrl from './RootCtrl';

class MessageCtrl extends RootCtrl {
    private hotspotRepository: HotspotRepositoryInMemory;
    private messageRepository: MessageRepositoryPostgreSql;
    private messageFactory: MessageFactory;
    private static HOTSPOT_NOT_FOUND = 'Hotspot not found';
    private static MESSAGE_NOT_FOUND = 'Message not found';
    private static MESSAGE_PRIVATE = 'Message belong to a unaccesible hotspot';

    constructor(
        errorHandler: ErrorHandler,
        auth0Service: Auth0Service,
        hotspotRepositoryInMemory: HotspotRepositoryInMemory,
        messageRepositoryInMemory: MessageRepositoryPostgreSql,
        messageFactory: MessageFactory,
    ) {
        super(errorHandler, auth0Service);
        this.hotspotRepository = hotspotRepositoryInMemory;
        this.messageRepository = messageRepositoryInMemory;
        this.messageFactory = messageFactory;
    }

    // method=GET url=/hotspots/{hotspotId}/messages
    public getMessages = async (req: rest.Request, res: rest.Response, next: rest.Next) => {
        if (!this.hotspotRepository.isSet(req.params.hotspotId)) {
            return next(this.errorHandler.logAndCreateNotFound(`GET ${req.path()}`));
        }
        try {
            const hotspot = await this.hotspotRepository.findById(req.params.hotspotId);
            if (!hotspot) {
                return next(
                    this.errorHandler.logAndCreateNotFound(
                        `GET ${req.path()}`,
                        HotspotCtrl.HOTSPOT_NOT_FOUND,
                    ),
                );
            }

            if (!isAuthorized.toSeeMessages(hotspot, this.cityzenIfAuthenticated)) {
                return next(
                    this.errorHandler.logAndCreateUnautorized(
                        `GET ${req.path()}`,
                        MessageCtrl.MESSAGE_PRIVATE,
                    ),
                );
            }

            const hotspotContent: Message[] = await this.messageRepository.findByHotspotId(
                new HotspotId(req.params.hotspotId),
            );
            res.json(OK, hotspotContent);
        } catch (err) {
            return next(this.errorHandler.logAndCreateInternal(`GET ${req.path()}`, err));
        }
    };

    // method=GET url=/hotspots/{hotspotId}/messages/
    public getComments = async (req: rest.Request, res: rest.Response, next: rest.Next) => {
        const hotspotId = req.params.hotspotId;
        const messageId = req.params.messageId;

        if (!this.hotspotRepository.isSet(hotspotId)) {
            return next(this.errorHandler.logAndCreateNotFound(`GET ${req.path()}`));
        }
        try {
            const hotspot = await this.hotspotRepository.findById(hotspotId);
            if (!hotspot) {
                return next(
                    this.errorHandler.logAndCreateNotFound(
                        `GET ${req.path}`,
                        HotspotCtrl.HOTSPOT_NOT_FOUND,
                    ),
                );
            }

            if (!isAuthorized.toSeeMessages(hotspot, this.cityzenIfAuthenticated)) {
                return next(
                    this.errorHandler.logAndCreateUnautorized(
                        `GET ${req.path}`,
                        MessageCtrl.MESSAGE_PRIVATE,
                    ),
                );
            }

            const comments = await this.messageRepository.findComments(new MessageId(messageId));
            res.json(OK, comments);
        } catch (err) {
            return next(this.errorHandler.logAndCreateInternal(`GET ${req.path()}`, err));
        }
    };

    // method=POST url=/hotspots/{hotspotId}/messages
    public postMessage = async (req: rest.Request, res: rest.Response, next: rest.Next) => {
        if (!this.schemaValidator.validate(createMessageSchema, req.body)) {
            return next(
                this.errorHandler.logAndCreateBadRequest(
                    `POST ${req.path()}`,
                    this.schemaValidator.errorsText(),
                ),
            );
        }
        if (!this.hotspotRepository.isSet(req.params.hotspotId)) {
            return next(
                this.errorHandler.logAndCreateNotFound(
                    `POST ${req.path()}`,
                    MessageCtrl.HOTSPOT_NOT_FOUND,
                ),
            );
        }

        const hotspot = await this.hotspotRepository.findById(req.params.hotspotId);
        if (!hotspot) {
            return next(
                this.errorHandler.logAndCreateNotFound(
                    `POST ${req.path()}`,
                    HotspotCtrl.HOTSPOT_NOT_FOUND,
                ),
            );
        }

        if (!isAuthorized.toPostMessages(hotspot, this.cityzenIfAuthenticated)) {
            return next(
                this.errorHandler.logAndCreateUnautorized(
                    `POST ${req.path()}`,
                    MessageCtrl.MESSAGE_PRIVATE,
                ),
            );
        }

        try {
            req.body.hotspotId = req.params.hotspotId;
            req.body.cityzen = this.cityzenIfAuthenticated;
            const newMessage = this.messageFactory.createMessage(req.body);
            await this.messageRepository.store(newMessage);
            res.json(CREATED, newMessage);
        } catch (err) {
            return next(this.errorHandler.logAndCreateInternal(`POST ${req.path()}`, err));
        }
    };

    // method=PATCH url=/hotspots/{hotspotId}/messages/{messageId}
    public patchMessage = async (req: rest.Request, res: rest.Response, next: rest.Next) => {
        let message: Message;

        if (!this.schemaValidator.validate(patchMessageSchema, req.body)) {
            return next(
                this.errorHandler.logAndCreateBadRequest(
                    `PATCH ${req.path()}`,
                    this.schemaValidator.errorsText(),
                ),
            );
        }

        const hotspot = await this.hotspotRepository.findById(req.params.hotspotId);
        if (!hotspot) {
            return next(
                this.errorHandler.logAndCreateNotFound(
                    `PATCH ${req.path()}`,
                    HotspotCtrl.HOTSPOT_NOT_FOUND,
                ),
            );
        }

        try {
            message = await this.messageRepository.findById(new MessageId(req.params.messageId));
        } catch (err) {
            return next(this.errorHandler.logAndCreateInternal(`PATCH ${req.path()}`, err));
        }
        if (!message) {
            return next(
                this.errorHandler.logAndCreateNotFound(
                    `PATCH ${req.path()}`,
                    MessageCtrl.MESSAGE_NOT_FOUND,
                ),
            );
        }

        if (!isAuthorized.toPatchMessage(hotspot, message, this.cityzenIfAuthenticated)) {
            return next(
                this.errorHandler.logAndCreateUnautorized(
                    `PATCH ${req.path()}`,
                    MessageCtrl.MESSAGE_PRIVATE,
                ),
            );
        }

        // TODO encapsuler la logique suivante
        try {
            if (req.body.title !== undefined) {
                message.changeTitle(req.body.title);
            }
            if (req.body.body !== undefined) {
                message.editBody(req.body.body);
            }
            if (req.body.pinned !== undefined) {
                if (message.pinned !== req.body.pinned) message.togglePinMode();
            }
            await this.messageRepository.update(message);
        } catch (err) {
            return next(this.errorHandler.logAndCreateInternal(`PATCH ${req.path()}`, err));
        }
        res.json(OK, message);
    };

    // method=DELETE url=/hotspots/{hotspotId}/messages/{messageId}
    public removeMessage = async (req: rest.Request, res: rest.Response, next: rest.Next) => {
        if (!this.messageRepository.isSet(new MessageId(req.params.messageId))) {
            return next(
                this.errorHandler.logAndCreateNotFound(
                    `DELETE ${req.path()}`,
                    MessageCtrl.MESSAGE_NOT_FOUND,
                ),
            );
        }

        const hotspot = await this.hotspotRepository.findById(req.params.hotspotId);
        if (!hotspot) {
            return next(
                this.errorHandler.logAndCreateNotFound(
                    `GET ${req.path()}`,
                    HotspotCtrl.HOTSPOT_NOT_FOUND,
                ),
            );
        }

        if (!isAuthorized.toRemoveMessages(hotspot, this.cityzenIfAuthenticated)) {
            return next(
                this.errorHandler.logAndCreateUnautorized(
                    `DELETE ${req.path()}`,
                    MessageCtrl.MESSAGE_PRIVATE,
                ),
            );
        }

        try {
            await this.messageRepository.delete(new MessageId(req.params.messageId));
        } catch (err) {
            return next(this.errorHandler.logAndCreateInternal(`DELETE ${req.path()}`, err));
        }
        res.json(OK, getStatusText(OK));
    };
}
export default MessageCtrl;
