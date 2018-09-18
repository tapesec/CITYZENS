import * as Chai from 'chai';
import * as config from './../../../src/api/config';

describe('Config check', () => {
    it('No undefined or null', () => {
        Chai.expect(config.default.algolia.algoliaApiKey == null).to.be.false;
        Chai.expect(config.default.algolia.algoliaAppId == null).to.be.false;
        Chai.expect(config.default.algolia.algoliaEnv == null).to.be.false;
        Chai.expect(config.default.algolia.opts.timeout == null).to.be.false;

        Chai.expect(config.default.auth.auth0Audience == null).to.be.false;
        Chai.expect(config.default.auth.auth0ClientId == null).to.be.false;
        Chai.expect(config.default.auth.auth0ClientSecret == null).to.be.false;
        Chai.expect(config.default.auth.auth0JwtPayloadNamespace == null).to.be.false;
        Chai.expect(config.default.auth.auth0ManagementApiToken == null).to.be.false;
        Chai.expect(config.default.auth.auth0url == null).to.be.false;

        Chai.expect(config.default.avatarIcon.defaultMediaIcon == null).to.be.false;
        Chai.expect(config.default.avatarIcon.defaultAlertIcon == null).to.be.false;

        Chai.expect(config.default.credentials.adminPassword == null).to.be.false;
        Chai.expect(config.default.credentials.adminUsername == null).to.be.false;
        Chai.expect(config.default.credentials.standardPassword == null).to.be.false;
        Chai.expect(config.default.credentials.standardUsername == null).to.be.false;

        Chai.expect(config.default.filestack.apiKey == null).to.be.false;
        Chai.expect(config.default.filestack.apiUrl == null).to.be.false;
        Chai.expect(config.default.filestack.security == null).to.be.false;

        Chai.expect(config.default.server.env == null).to.be.false;
        Chai.expect(config.default.server.httpPort == null).to.be.false;

        Chai.expect(config.default.slack.slackWebhookErrorUrl == null).to.be.false;

        Chai.expect(config.default.test.standardAuth0id == null).to.be.false;

        Chai.expect(config.default.cityzen.defaultAvatar == null).to.be.false;
    });
});
