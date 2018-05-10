import * as server from './../../src/api/server';
import { expect } from 'chai';
import * as request from 'supertest';
import wallHotspotsTests from './wallHotspot.spec';
import eventHotspotsTests from './eventHotspot.spec';
import alertHotspotsTests from './alertHotspot.spec';
import hotspotsEndpointsTests from './hotspots.spec';
import citiesEndpointTests from './cities.spec';
import messagesEndpointsTests from './messages.spec';
import * as LoginSample from './sample/LoginSample';
import { votingPath } from './Voting.spec';
import config from './../../src/api/config';

describe('/auth endpoint', () => {
    const state: any = { admin: {}, standard: {} };

    state.admin.access_token = config.credentials.adminAccessToken;
    state.standard.access_token = config.credentials.standardAccessToken;
    state.standard.auth0id = config.test.standardAuth0id;

    wallHotspotsTests(state);
    eventHotspotsTests(state);
    alertHotspotsTests(state);
    // /hotspots tests suite
    hotspotsEndpointsTests(state);
    // /cities tests suite
    citiesEndpointTests(state);
    // /hotspots/id/messages suite
    messagesEndpointsTests(state);

    // Start scenario of users interactions
    votingPath(state);
});
