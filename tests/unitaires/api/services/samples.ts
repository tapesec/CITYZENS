import DecodedJwtPayload from '../../../../src/api/services/auth/DecodedJwtPayload';
import config from '../../../../src/api/config';
import UserInfoAuth0 from '../../../../src/api/services/auth/UserInfoAuth0';

const decodedToken = {
    sub: 'fake-id',
    email: 'fake@email.com',
    nickname: 'Alice',
    [`${config.auth.auth0JwtPayloadNamespace}/user_metadata`]: {
        favoritesHotspots: ['an-hotspot-id'],
    },
};

export const DECODED_PAYLOAD = new DecodedJwtPayload(
    decodedToken,
    config.auth.auth0JwtPayloadNamespace,
);

const malformedDecodedToken = {
    email: 'fake@email.com',
    nickname: 'Alice',
    [`${config.auth.auth0JwtPayloadNamespace}/user_metadata`]: {
        favoritesHotspots: ['an-hotspot-id'],
    },
};

export const MALFORMED_DECODED_PAYLOAD = new DecodedJwtPayload(
    malformedDecodedToken,
    config.auth.auth0JwtPayloadNamespace,
);

export const FAKE_USER_INFO_BODY = `
{
    "sub": "s",
    "nickname": "n",
    "name": "n",
    "picture": "p",
    "updatedAt": "a",
    "email": "e",
    "email_verified": true,
    "https://www.cityzen.fr/user_metadata": {},
    "https://www.cityzen.fr/app_metadata": {}
}
`;

export const FAKE_USER_INFO_AUTH0 = new UserInfoAuth0(
    `
{
    "sub": "s",
    "nickname": "n",
    "name": "n",
    "picture": "p",
    "updatedAt": "a",
    "email": "e",
    "email_verified": true,
    "https://www.cityzen.fr/user_metadata": {},
    "https://www.cityzen.fr/app_metadata": {}
}
`,
    '',
);

export const FAKE_ADMIN_USER_INFO_AUTH0 = new UserInfoAuth0(
    `
{
    "sub": "s",
    "nickname": "n",
    "name": "n",
    "picture": "p",
    "updatedAt": "a",
    "email": "e",
    "email_verified": true,
    "https://www.cityzen.fr/user_metadata": {
        "isAdmin": true
    },
    "https://www.cityzen.fr/app_metadata": {}
}
`,
    '',
);

export const ILL_USER_INFO_AUTH0 = new UserInfoAuth0(
    `
{
    "subaze": "s",
    "niaezckname": "n",
    "nzame": "n",
    "picturqsdqe": "p",
    "emaiqsdl": "e",
    "email_qsdverified": true
}
`,
    '',
);
