import config from './../../../src/api/config';

export const badSample = {
    username: 'fake',
    password: 'faler',
};

export const adminSample = {
    username: config.credentials.adminUsername,
    password: config.credentials.adminPassword,
};

export const standardSample = {
    username: config.credentials.standardUsername,
    password: config.credentials.standardPassword,
};
