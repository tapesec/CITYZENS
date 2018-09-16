import { CREATED, getStatusText, OK } from 'http-status-codes';
import * as rest from 'restify';
import Auth0Service from 'src/api/services/auth/Auth0Service';
import HotspotId from '../../domain/hotspot/HotspotId';
import MessageId from '../../domain/hotspot/MessageId';
import Message from '../../domain/hotspot/Message';
import CityzenRepositoryPostgreSQL from '../../infrastructure/CityzenRepositoryPostgreSQL';
import HotspotRepositoryPostgreSQL from '../../infrastructure/HotspotRepositoryPostgreSQL';
import MessageFactory from '../../domain/hotspot/MessageFactory';
import MessageRepositoryPostgreSql from '../../infrastructure/MessageRepositoryPostgreSQL';
import {
    createMessageSchema,
    getMessageSchemaQuery,
    patchMessageSchema,
} from '../requestValidation/schema';
import * as isAuthorized from '../../domain/hotspot/isAuthorized';
import HotspotCtrl from './HotspotCtrl';
import RootCtrl from './RootCtrl';
import IHotspotRepository from '../../domain/hotspot/IHotspotRepository';

class MessageCtrl extends RootCtrl {
    private messageRepository: MessageRepositoryPostgreSql;
    private messageFactory: MessageFactory;

    private static HOTSPOT_NOT_FOUND = 'Hotspot not found';
    private static MESSAGE_NOT_FOUND = 'Message not found';
    private static MESSAGE_PRIVATE = 'Message belong to a unaccesible hotspot';

    constructor(
        auth0Service: Auth0Service,
        cityzenRepository: CityzenRepositoryPostgreSQL,
        private hotspotRepository: IHotspotRepository,
        messageRepositoryInMemory: MessageRepositoryPostgreSql,
        messageFactory: MessageFactory,
    ) {
        super(auth0Service, cityzenRepository);
        this.messageRepository = messageRepositoryInMemory;
        this.messageFactory = messageFactory;
    }

    // method=GET url=/hotspots/{hotspotId}/messages
    public getMessages = async (req: rest.Request, res: rest.Response, next: rest.Next) => {
        if (req.query.count !== undefined) {
            return this.listCommentsCount(req, res, next);
        }
        return this.listMessages(req, res, next);
    };

    private listCommentsCount = async (req: rest.Request, res: rest.Response, next: rest.Next) => {
        try {
            if (!this.schemaValidator.validate(getMessageSchemaQuery, req.query)) {
                return next(
                    this.responseError.logAndCreateBadRequest(
                        req,
                        this.schemaValidator.errorsText(),
                    ),
                );
            }

            if (!this.hotspotRepository.isSet(req.params.hotspotId)) {
                return next(this.responseError.logAndCreateNotFound(req));
            }
            const hotspot = await this.hotspotRepository.findById(req.params.hotspotId);

            const messages = (req.query.messages as string).split(',').map(x => new MessageId(x));
            if (!hotspot) {
                return next(
                    this.responseError.logAndCreateNotFound(req, HotspotCtrl.HOTSPOT_NOT_FOUND),
                );
            }

            if (!isAuthorized.toSeeMessages(hotspot, this.cityzenIfAuthenticated)) {
                return next(
                    this.responseError.logAndCreateUnautorized(req, MessageCtrl.MESSAGE_PRIVATE),
                );
            }
            const commentCountJson = await this.messageRepository.getCommentsCount(messages);
            res.json(OK, commentCountJson);
        } catch (err) {
            return next(this.responseError.logAndCreateInternal(req, err));
        }
    };

    // method=GET url=/hotspots/{hotspotId}/messages
    private listMessages = async (req: rest.Request, res: rest.Response, next: rest.Next) => {
        if (!this.hotspotRepository.isSet(req.params.hotspotId)) {
            return next(this.responseError.logAndCreateNotFound(req));
        }
        try {
            const hotspot = await this.hotspotRepository.findById(req.params.hotspotId);
            if (!hotspot) {
                return next(
                    this.responseError.logAndCreateNotFound(req, HotspotCtrl.HOTSPOT_NOT_FOUND),
                );
            }

            if (!isAuthorized.toSeeMessages(hotspot, this.cityzenIfAuthenticated)) {
                return next(
                    this.responseError.logAndCreateUnautorized(req, MessageCtrl.MESSAGE_PRIVATE),
                );
            }

            const hotspotContent: Message[] = await this.messageRepository.findByHotspotId(
                new HotspotId(req.params.hotspotId),
            );
            res.json(OK, hotspotContent);
        } catch (err) {
            return next(this.responseError.logAndCreateInternal(req, err));
        }
    };

    // method=GET url=/hotspots/{hotspotId}/messages/
    public getComments = async (req: rest.Request, res: rest.Response, next: rest.Next) => {
        const hotspotId = req.params.hotspotId;
        const messageId = req.params.messageId;

        if (!this.hotspotRepository.isSet(hotspotId)) {
            return next(this.responseError.logAndCreateNotFound(req));
        }
        try {
            const hotspot = await this.hotspotRepository.findById(hotspotId);
            if (!hotspot) {
                return next(
                    this.responseError.logAndCreateNotFound(req, HotspotCtrl.HOTSPOT_NOT_FOUND),
                );
            }

            if (!isAuthorized.toSeeMessages(hotspot, this.cityzenIfAuthenticated)) {
                return next(
                    this.responseError.logAndCreateUnautorized(req, MessageCtrl.MESSAGE_PRIVATE),
                );
            }

            const comments = await this.messageRepository.findComments(new MessageId(messageId));
            res.json(OK, comments);
        } catch (err) {
            return next(this.responseError.logAndCreateInternal(req, err));
        }
    };

    // method=POST url=/hotspots/{hotspotId}/messages
    public postMessage = async (req: rest.Request, res: rest.Response, next: rest.Next) => {
        if (!this.schemaValidator.validate(createMessageSchema, req.body)) {
            return next(
                this.responseError.logAndCreateBadRequest(req, this.schemaValidator.errorsText()),
            );
        }
        if (!this.hotspotRepository.isSet(req.params.hotspotId)) {
            return next(
                this.responseError.logAndCreateNotFound(req, MessageCtrl.HOTSPOT_NOT_FOUND),
            );
        }

        const hotspot = await this.hotspotRepository.findById(req.params.hotspotId);
        if (!hotspot) {
            return next(
                this.responseError.logAndCreateNotFound(req, HotspotCtrl.HOTSPOT_NOT_FOUND),
            );
        }

        if (!isAuthorized.toPostMessages(hotspot, this.cityzenIfAuthenticated)) {
            return next(
                this.responseError.logAndCreateUnautorized(req, MessageCtrl.MESSAGE_PRIVATE),
            );
        }

        try {
            req.body.hotspotId = req.params.hotspotId;
            req.body.cityzen = this.cityzenIfAuthenticated;
            const newMessage = this.messageFactory.createMessage(req.body);
            await this.messageRepository.store(newMessage);
            res.json(CREATED, newMessage);
        } catch (err) {
            return next(this.responseError.logAndCreateInternal(req, err));
        }
    };

    // method=POST url=/hotspots/{hotspotId}/messages/{messageId}/comment
    public postComment = async (req: rest.Request, res: rest.Response, next: rest.Next) => {
        if (!this.schemaValidator.validate(createMessageSchema, req.body)) {
            return next(
                this.responseError.logAndCreateBadRequest(req, this.schemaValidator.errorsText()),
            );
        }
        if (!this.hotspotRepository.isSet(req.params.hotspotId)) {
            return next(
                this.responseError.logAndCreateNotFound(req, MessageCtrl.HOTSPOT_NOT_FOUND),
            );
        }
        const hotspot = await this.hotspotRepository.findById(req.params.hotspotId);
        if (!hotspot) {
            return next(
                this.responseError.logAndCreateNotFound(req, HotspotCtrl.HOTSPOT_NOT_FOUND),
            );
        }

        if (!isAuthorized.toPostComments(hotspot, this.cityzenIfAuthenticated)) {
            return next(
                this.responseError.logAndCreateUnautorized(req, MessageCtrl.MESSAGE_PRIVATE),
            );
        }

        try {
            req.body.hotspotId = req.params.hotspotId;
            req.body.parentId = req.params.messageId;
            req.body.cityzen = this.cityzenIfAuthenticated;
            const newMessage = this.messageFactory.createMessage(req.body);
            await this.messageRepository.store(newMessage);
            res.json(CREATED, newMessage);
        } catch (err) {
            return next(this.responseError.logAndCreateInternal(req, err));
        }
    };

    // method=PATCH url=/hotspots/{hotspotId}/messages/{messageId}
    public patchMessage = async (req: rest.Request, res: rest.Response, next: rest.Next) => {
        let message: Message;

        if (!this.schemaValidator.validate(patchMessageSchema, req.body)) {
            return next(
                this.responseError.logAndCreateBadRequest(req, this.schemaValidator.errorsText()),
            );
        }

        const hotspot = await this.hotspotRepository.findById(req.params.hotspotId);
        if (!hotspot) {
            return next(
                this.responseError.logAndCreateNotFound(req, HotspotCtrl.HOTSPOT_NOT_FOUND),
            );
        }

        try {
            message = await this.messageRepository.findById(new MessageId(req.params.messageId));
        } catch (err) {
            return next(this.responseError.logAndCreateInternal(req, err));
        }
        if (!message) {
            return next(
                this.responseError.logAndCreateNotFound(req, MessageCtrl.MESSAGE_NOT_FOUND),
            );
        }

        if (!isAuthorized.toPatchMessage(message, this.cityzenIfAuthenticated)) {
            return next(
                this.responseError.logAndCreateUnautorized(req, MessageCtrl.MESSAGE_PRIVATE),
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
            return next(this.responseError.logAndCreateInternal(req, err));
        }
        res.json(OK, message);
    };

    // method=DELETE url=/hotspots/{hotspotId}/messages/{messageId}
    public removeMessage = async (req: rest.Request, res: rest.Response, next: rest.Next) => {
        const messageId = new MessageId(req.params.messageId);
        if (!this.messageRepository.isSet(messageId)) {
            return next(
                this.responseError.logAndCreateNotFound(req, MessageCtrl.MESSAGE_NOT_FOUND),
            );
        }

        const hotspot = await this.hotspotRepository.findById(req.params.hotspotId);
        if (!hotspot) {
            return next(
                this.responseError.logAndCreateNotFound(req, HotspotCtrl.HOTSPOT_NOT_FOUND),
            );
        }

        const message = await this.messageRepository.findById(messageId);
        if (!isAuthorized.toRemoveMessages(message, this.cityzenIfAuthenticated)) {
            return next(
                this.responseError.logAndCreateUnautorized(req, MessageCtrl.MESSAGE_PRIVATE),
            );
        }

        try {
            await this.messageRepository.delete(new MessageId(req.params.messageId));
        } catch (err) {
            return next(this.responseError.logAndCreateInternal(req, err));
        }
        res.json(OK, getStatusText(OK));
    };
}
export default MessageCtrl;
