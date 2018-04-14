import { S_IFBLK } from 'constants';
import * as TypeMoq from 'typemoq';
import * as Sinon from 'sinon';
import * as Chai from 'chai';

import SlackWebhook from './../../../../../src/api/libs/SlackWebhook';
import ErrorHandler from '../../../../../src/api/services/errors/ErrorHandler';

describe('Error service.', () => {
    let httpLoggerStub: any;
    let slackWebHookStub: any;
    let restifyErrorsStub: any;

    beforeEach(() => {
        httpLoggerStub = { info: Sinon.stub() };
        restifyErrorsStub = {
            BadRequestError: Sinon.stub(),
            UnauthorizedError: Sinon.stub(),
            InvalidCredentialsError: Sinon.stub(),
            NotFoundError: Sinon.stub(),
            InternalServerError: Sinon.stub(),
        };

        slackWebHookStub = { alert: Sinon.stub() };
    });

    it(`logAndCreateInternal should return InternalError,
        call httpLogger once, call httpLogger and slackWebHook.`, () => {
        const errorHandler = new ErrorHandler(slackWebHookStub, httpLoggerStub, restifyErrorsStub);

        const error = new Error('');

        const internal = errorHandler.logAndCreateInternal(' ', error);

        Chai.expect(internal).to.be.eql(new restifyErrorsStub.InternalServerError(error));
        Chai.expect(httpLoggerStub.info.calledOnce).to.be.eql(true);
        Chai.expect(slackWebHookStub.alert.calledOnce).to.be.eql(true);
    });

    it(`logAndCreateBadRequest should return BadRequest error and call httpLogger.`, () => {
        const errorHandler = new ErrorHandler(slackWebHookStub, httpLoggerStub, restifyErrorsStub);

        const error = errorHandler.logAndCreateBadRequest(' ', ' ');
        Chai.expect(error).to.be.eql(new restifyErrorsStub.BadRequestError(' '));
        Chai.expect(httpLoggerStub.info.calledOnce).to.be.eql(true);
    });

    it(`logAndCreateUnautorized should return Unautorized error and call httpLogger.`, () => {
        const errorHandler = new ErrorHandler(slackWebHookStub, httpLoggerStub, restifyErrorsStub);

        const error = errorHandler.logAndCreateUnautorized(' ', ' ');
        Chai.expect(error).to.be.eql(new restifyErrorsStub.UnauthorizedError(' '));
        Chai.expect(httpLoggerStub.info.calledOnce).to.be.eql(true);
    });

    it(`logAndCreateInvalidCredentials should return InvalidCredentials error 
        and call httpLogger.`, () => {
        const errorHandler = new ErrorHandler(slackWebHookStub, httpLoggerStub, restifyErrorsStub);

        const error = errorHandler.logAndCreateInvalidCredentials(' ', ' ');
        Chai.expect(error).to.be.eql(new restifyErrorsStub.InvalidCredentialsError(' '));
        Chai.expect(httpLoggerStub.info.calledOnce).to.be.eql(true);
    });

    it(`logAndCreateNotFound should return NotFound error and call httpLogger once.`, () => {
        const errorHandler = new ErrorHandler(slackWebHookStub, httpLoggerStub, restifyErrorsStub);

        const error = errorHandler.logAndCreateNotFound(' ', ' ');
        Chai.expect(error).to.be.eql(new restifyErrorsStub.NotFoundError(' '));
        Chai.expect(httpLoggerStub.info.calledOnce).to.be.eql(true);
    });
});
