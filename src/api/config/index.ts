const httpPort = parseInt(process.env.HTTP_PORT, 10);
const auth0url = process.env.AUTH_0_URL;
const auth0ClientId = process.env.AUTH_0_CLIENT_ID;
const auth0ClientSecret = process.env.AUTH_0_CLIENT_SECRET;
const auth0Audience = process.env.AUTH_0_AUDIENCE;

export default {
    server: {
        httpPort,
    },
    auth: {
        auth0url,
        auth0ClientId,
        auth0ClientSecret,
        auth0Audience,
    },
};
