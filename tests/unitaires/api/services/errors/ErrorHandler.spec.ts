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
            InternalServerError: Sinon.stub()
         };

        slackWebHookStub = { alert: Sinon.stub() };
    });

    it(`logAndCreateBadRequest should call httpLogger once.`, () => {
        const errorHandler = new ErrorHandler(
            slackWebHookStub.object,
            httpLoggerStub,
            restifyErrorsStub,
        );
        
        errorHandler.logAndCreateBadRequest(" ", " ");
        Chai.assert(httpLoggerStub.info.calledOnce);
    });

    it(`logAndCreateInternal should call httpLogger and slackWebHook once.`, () => {
        const errorHandler = new ErrorHandler(
            slackWebHookStub,
            httpLoggerStub,
            restifyErrorsStub,
        );
        
        const json = {};

        errorHandler.logAndCreateInternal(' ', json);
        Chai.assert(httpLoggerStub.info.calledOnce);
        Chai.assert(slackWebHookStub.alert.calledOnce);
    });

    it(`logAndCreateInvalidCredentials should call httpLogger once.`, () => {
        const errorHandler = new ErrorHandler(
            slackWebHookStub,
            httpLoggerStub,
            restifyErrorsStub,
        );
        
        errorHandler.logAndCreateInvalidCredentials(" ", " ");
        Chai.assert(httpLoggerStub.info.calledOnce);
    });

    it(`logAndCreateNotFound should call httpLogger once.`, () => {
        const errorHandler = new ErrorHandler(
            slackWebHookStub,
            httpLoggerStub,
            restifyErrorsStub,
        );
        
        errorHandler.logAndCreateNotFound(" ", " ");
        Chai.assert(httpLoggerStub.info.calledOnce);
    });

    it(`logAndCreateUnautorized should call httpLogger once.`, () => {
        const errorHandler = new ErrorHandler(
            slackWebHookStub,
            httpLoggerStub,
            restifyErrorsStub,
        );
        
        errorHandler.logAndCreateUnautorized(" ", " ");
        Chai.assert(httpLoggerStub.info.calledOnce);
    });
    
    it(`logAndCreateBadRequest should return BadRequest error.`, () => {
        const errorHandler = new ErrorHandler(
            slackWebHookStub,
            httpLoggerStub,
            restifyErrorsStub,
        );
        
        errorHandler.logAndCreateBadRequest(" ", " ");
        Chai.assert(httpLoggerStub.info.calledOnce);
    });

    it(`logAndCreateInternal should call httpLogger once.`, () => {
        const errorHandler = new ErrorHandler(
            slackWebHookStub,
            httpLoggerStub,
            restifyErrorsStub,
        );
        
        const json = {};

        errorHandler.logAndCreateInternal(" ", json);
        Chai.assert(httpLoggerStub.info.calledOnce);
    });

    it(`logAndCreateBadRequest should return BadRequest error.`, () => {
        const errorHandler = new ErrorHandler(
            slackWebHookStub,
            httpLoggerStub,
            restifyErrorsStub,
        );
        
        const error = errorHandler.logAndCreateBadRequest(' ', ' ');
        Chai.expect(error).to.be.eql(new restifyErrorsStub.BadRequestError(' '));
    });

    it(`logAndCreateUnautorized should return Unautorized error.`, () => {
        const errorHandler = new ErrorHandler(
            slackWebHookStub,
            httpLoggerStub,
            restifyErrorsStub,
        );
        
        const error = errorHandler.logAndCreateUnautorized(' ', ' ');
        Chai.expect(error).to.be.eql(new restifyErrorsStub.UnauthorizedError(' '));
    });

    it(`logAndCreateInvalidCredentials should return InvalidCredentials error.`, () => {
        const errorHandler = new ErrorHandler(
            slackWebHookStub,
            httpLoggerStub,
            restifyErrorsStub,
        );
        
        const error = errorHandler.logAndCreateInvalidCredentials(' ', ' ');
        Chai.expect(error).to.be.eql(new restifyErrorsStub.InvalidCredentialsError(' '));
    });

    it(`logAndCreateNotFound should return NotFound error.`, () => {
        const errorHandler = new ErrorHandler(
            slackWebHookStub,
            httpLoggerStub,
            restifyErrorsStub,
        );
        
        const error = errorHandler.logAndCreateNotFound(' ', ' ');
        Chai.expect(error).to.be.eql(new restifyErrorsStub.NotFoundError(' '));
    });

    it(`logAndCreateInternal should return Internal error.`, () => {
        const errorHandler = new ErrorHandler(
            slackWebHookStub,
            httpLoggerStub,
            restifyErrorsStub,
        );
        
        const json = {};
        
        const error = errorHandler.logAndCreateInternal(" ", json);
        Chai.expect(error).to.be.eql(new restifyErrorsStub.InternalServerError(json));
    });


});