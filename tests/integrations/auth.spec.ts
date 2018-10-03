import { expect } from 'chai';
import * as request from 'supertest';
import config from './../../src/api/config';
import { server, initDB } from './../../src/api/server';
import alertHotspotsTests from './alertHotspot.spec';
import citiesEndpointTests from './cities.spec';
import cityzenTest from './cityzen.spec';
import hotspotsEndpointsTests from './hotspots.spec';
import mediaHotspotSpec from './mediaHotspot.spec';
import messagesEndpointsTests from './messages.spec';
import * as LoginSample from './sample/LoginSample';
import { votingPath } from './Voting.spec';

before('initDB', async () => {
    await initDB();
    console.log('Data ready for test processing ...');
});

describe('/auth endpoint', function() {
    this.timeout(10000);
    const state: any = { admin: {}, standard: {} };

    describe('POST /signup', () => {
        it.only('Should register a user and send a jwt', async () => {
            const signupBody = {
                email: 'jean.dupont@gmail.com',
                password: 'azerty1234',
                username: 'jeanjean',
            };
            const responseSignin = await request(server)
                .post('/signup')
                .send(signupBody)
                .set('Accept', 'application/json')
                .expect(201);
            console.log(responseSignin, 'debug');
            expect(responseSignin.body).to.have.property('accessToken');
        });
    });

    describe('POST /auth/token', () => {
        it('should return jwt token after received credentials', async () => {
            const loginBody = {
                email: LoginSample.adminSample.username,
                password: LoginSample.adminSample.password,
            };

            // Act
            const responseAdmin = await request(server)
                .post('/auth/token')
                .send(loginBody)
                .set('Accept', 'application/json')
                .expect(200);
            expect(responseAdmin.body).to.have.property('accessToken');

            loginBody.email = LoginSample.standardSample.username;
            loginBody.password = LoginSample.standardSample.password;

            const responseStandard = await request(server)
                .post('/auth/token')
                .send(loginBody)
                .set('Accept', 'application/json')
                .expect(200);
            expect(responseAdmin.body).to.have.property('accessToken');
            // Assert

            state.admin.access_token = responseAdmin.body.access_token;
            state.standard.access_token = responseStandard.body.access_token;
            state.standard.auth0id = config.test.standardAuth0id;
        });
    });

    cityzenTest(state);

    mediaHotspotSpec(state);
    alertHotspotsTests(state);
    // /hotspots tests suite
    hotspotsEndpointsTests(state);
    // /cities tests suite
    citiesEndpointTests(state);
    // /hotspots/id/messages suite
    messagesEndpointsTests(state);

    // Start scenario of users interactions
    votingPath(state);

    after('drop tables after tests suite', async () => {});
});
