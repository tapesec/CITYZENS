const httpPort = parseInt(process.env.HTTP_PORT, 10);
const auth0url = process.env.AUTH_0_URL;
const auth0ClientId = process.env.AUTH_0_CLIENT_ID;
const auth0ClientSecret = process.env.AUTH_0_CLIENT_SECRET;
const auth0Audience = process.env.AUTH_0_AUDIENCE;
const auth0ManagementApiToken = process.env.AUTH_0_MANAGEMENT_API_TOKEN;
const auth0JwtPayloadNamespace = 'https://www.cityzen.fr';

export default {
    server: {
        httpPort,
    },
    auth: {
        auth0url,
        auth0ClientId,
        auth0ClientSecret,
        auth0Audience,
        auth0ManagementApiToken,
        auth0JwtPayloadNamespace,
    },
};
