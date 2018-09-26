import { CREATED, getStatusText, OK } from 'http-status-codes';
import * as rest from 'restify';
import HotspotId from '../../application/domain/hotspot/HotspotId';
import MessageId from '../../application/domain/hotspot/MessageId';
import Message from '../../application/domain/hotspot/Message';
import MessageFactory from '../../application/domain/hotspot/MessageFactory';
import MessageRepositoryPostgreSql from '../../infrastructure/MessageRepositoryPostgreSQL';
import {
    createMessageSchema,
    getMessageSchemaQuery,
    patchMessageSchema,
} from '../requestValidation/schema';
import * as isAuthorized from '../../application/domain/hotspot/services/isAuthorized';
import HotspotCtrl from './HotspotCtrl';
import RootCtrl from './RootCtrl';
import Carte from '../../application/domain/hotspot/Carte';
import ActualiteHotspot from '../../application/usecases/ActualiteHotspot';
import UseCaseStatus from '../../application/usecases/UseCaseStatus';
import ObtenirCommentaires from '../../application/usecases/ObtenirCommentaires';
import PublierUnMessage from '../../application/usecases/PublierUnMessage';
import RepondreAUnMessage from '../../application/usecases/RepondreAUnMessage';
import EditerUnMessage from '../../application/usecases/EditerUnMessage';

class MessageCtrl extends RootCtrl {
    private messageRepository: MessageRepositoryPostgreSql;
    private messageFactory: MessageFactory;

    private static HOTSPOT_NOT_FOUND = 'Hotspot not found';
    private static MESSAGE_NOT_FOUND = 'Message not found';
    private static MESSAGE_PRIVATE = 'Message belong to a unaccesible hotspot';
    private static MESSAGE_REPLY_UNAUTHORIZED = 'Cant reply to this message';

    constructor(
        private hotspotRepository: Carte,
        messageRepositoryInMemory: MessageRepositoryPostgreSql,
        messageFactory: MessageFactory,
        protected actualiteHotspot: ActualiteHotspot,
        protected obtenirCommentaires: ObtenirCommentaires,
        protected publierUnMessage: PublierUnMessage,
        protected repondreAUnMessage: RepondreAUnMessage,
        protected editerUnMessage: EditerUnMessage,
    ) {
        super();
        this.messageRepository = messageRepositoryInMemory;
        this.messageFactory = messageFactory;
    }

    // method=GET url=/hotspots/{hotspotId}/messages
    public getMessages = async (req: rest.Request, res: rest.Response, next: rest.Next) => {
        if (req.query.count !== undefined) {
            await this.listCommentsCount(req, res, next);
            return;
        }
        await this.listMessages(req, res, next);
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
            const messagesId = (req.query.messages as string).split(',').map(x => new MessageId(x));
            const useCaseResult = await this.actualiteHotspot.compteNombreCommentairesParMessage({
                messagesId,
                user: req.cityzenIfAuthenticated,
                hotspotId: new HotspotId(req.params.hotspotId),
            });
            if (useCaseResult.status === UseCaseStatus.NOT_FOUND) {
                return next(
                    this.responseError.logAndCreateNotFound(req, HotspotCtrl.HOTSPOT_NOT_FOUND),
                );
            }
            if (useCaseResult.status === UseCaseStatus.UNAUTHORIZED) {
                return next(
                    this.responseError.logAndCreateUnautorized(req, MessageCtrl.MESSAGE_PRIVATE),
                );
            }
            res.json(OK, useCaseResult.countCommentsPerMessages);
        } catch (err) {
            return next(this.responseError.logAndCreateInternal(req, err));
        }
    };

    // method=GET url=/hotspots/{hotspotId}/messages
    private listMessages = async (req: rest.Request, res: rest.Response, next: rest.Next) => {
        try {
            const useCaseResult = await this.actualiteHotspot.listeMessages({
                user: req.cityzenIfAuthenticated,
                hotspotId: new HotspotId(req.params.hotspotId),
            });
            if (useCaseResult.status === UseCaseStatus.NOT_FOUND) {
                return next(
                    this.responseError.logAndCreateNotFound(req, HotspotCtrl.HOTSPOT_NOT_FOUND),
                );
            }
            if (useCaseResult.status === UseCaseStatus.UNAUTHORIZED) {
                return next(
                    this.responseError.logAndCreateUnautorized(req, MessageCtrl.MESSAGE_PRIVATE),
                );
            }
            res.json(OK, useCaseResult.messages);
        } catch (err) {
            return next(this.responseError.logAndCreateInternal(req, err));
        }
    };

    // method=GET url=/hotspots/{hotspotId}/messages/
    public getComments = async (req: rest.Request, res: rest.Response, next: rest.Next) => {
        try {
            const hotspotId = new HotspotId(req.params.hotspotId);
            const messageId = new MessageId(req.params.messageId);
            const useCaseResult = await this.obtenirCommentaires.run({
                hotspotId,
                messageId,
                user: req.cityzenIfAuthenticated,
            });
            if (useCaseResult.status === UseCaseStatus.NOT_FOUND) {
                return next(
                    this.responseError.logAndCreateNotFound(req, HotspotCtrl.HOTSPOT_NOT_FOUND),
                );
            }
            if (useCaseResult.status === UseCaseStatus.UNAUTHORIZED) {
                return next(
                    this.responseError.logAndCreateUnautorized(req, MessageCtrl.MESSAGE_PRIVATE),
                );
            }
            res.json(OK, useCaseResult.comments);
        } catch (err) {
            return next(this.responseError.logAndCreateInternal(req, err));
        }
    };

    // method=POST url=/hotspots/{hotspotId}/messages
    public postMessage = async (req: rest.Request, res: rest.Response, next: rest.Next) => {
        try {
            if (!this.schemaValidator.validate(createMessageSchema, req.body)) {
                return next(
                    this.responseError.logAndCreateBadRequest(
                        req,
                        this.schemaValidator.errorsText(),
                    ),
                );
            }
            const useCaseResult = await this.publierUnMessage.run({
                user: req.cityzenIfAuthenticated,
                hotspotId: new HotspotId(req.params.hotspotId),
                payload: req.body,
            });
            if (useCaseResult.status === UseCaseStatus.NOT_FOUND) {
                return next(
                    this.responseError.logAndCreateNotFound(req, MessageCtrl.HOTSPOT_NOT_FOUND),
                );
            }
            if (useCaseResult.status === UseCaseStatus.UNAUTHORIZED) {
                return next(
                    this.responseError.logAndCreateUnautorized(req, MessageCtrl.MESSAGE_PRIVATE),
                );
            }
            res.json(CREATED, useCaseResult.newMessage);
        } catch (err) {
            return next(this.responseError.logAndCreateInternal(req, err));
        }
    };

    // method=POST url=/hotspots/{hotspotId}/messages/{messageId}/comment
    public postComment = async (req: rest.Request, res: rest.Response, next: rest.Next) => {
        try {
            if (!this.schemaValidator.validate(createMessageSchema, req.body)) {
                return next(
                    this.responseError.logAndCreateBadRequest(
                        req,
                        this.schemaValidator.errorsText(),
                    ),
                );
            }
            const useCaseResult = await this.repondreAUnMessage.run({
                user: req.cityzenIfAuthenticated,
                messageId: new MessageId(req.params.messageId),
                hotspotId: new HotspotId(req.params.hotspotId),
                payload: req.body,
            });
            if (useCaseResult.status === UseCaseStatus.NOT_FOUND) {
                return next(
                    this.responseError.logAndCreateNotFound(req, MessageCtrl.HOTSPOT_NOT_FOUND),
                );
            }
            if (useCaseResult.status === UseCaseStatus.MESSAGE_NOT_FOUND) {
                return next(
                    this.responseError.logAndCreateNotFound(req, MessageCtrl.MESSAGE_NOT_FOUND),
                );
            }
            if (useCaseResult.status === UseCaseStatus.UNAUTHORIZED) {
                return next(
                    this.responseError.logAndCreateUnautorized(
                        req,
                        MessageCtrl.MESSAGE_REPLY_UNAUTHORIZED,
                    ),
                );
            }
            res.json(CREATED, useCaseResult.newResponse);
        } catch (err) {
            return next(this.responseError.logAndCreateInternal(req, err));
        }
    };

    // method=PATCH url=/hotspots/{hotspotId}/messages/{messageId}
    public patchMessage = async (req: rest.Request, res: rest.Response, next: rest.Next) => {
        try {
            if (!this.schemaValidator.validate(patchMessageSchema, req.body)) {
                return next(
                    this.responseError.logAndCreateBadRequest(
                        req,
                        this.schemaValidator.errorsText(),
                    ),
                );
            }
            const useCaseResult = await this.editerUnMessage.run({
                user: req.cityzenIfAuthenticated,
                hotspotId: new HotspotId(req.params.hotspotId),
                messageId: new MessageId(req.params.messageId),
                payload: req.body,
            });
            if (useCaseResult.status === UseCaseStatus.NOT_FOUND) {
                return next(
                    this.responseError.logAndCreateNotFound(req, MessageCtrl.HOTSPOT_NOT_FOUND),
                );
            }
            if (useCaseResult.status === UseCaseStatus.MESSAGE_NOT_FOUND) {
                return next(
                    this.responseError.logAndCreateNotFound(req, MessageCtrl.MESSAGE_NOT_FOUND),
                );
            }
            if (useCaseResult.status === UseCaseStatus.UNAUTHORIZED) {
                return next(
                    this.responseError.logAndCreateUnautorized(req, MessageCtrl.MESSAGE_PRIVATE),
                );
            }
            res.json(OK, useCaseResult.editedMessage);
        } catch (err) {
            return next(this.responseError.logAndCreateInternal(req, err));
        }
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
        if (!isAuthorized.toRemoveMessages(message, req.cityzenIfAuthenticated)) {
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
