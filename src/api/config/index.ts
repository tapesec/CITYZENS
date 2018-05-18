const httpPort = parseInt(process.env.HTTP_PORT, 10);
const auth0url = process.env.AUTH_0_URL;
const auth0ClientId = process.env.AUTH_0_CLIENT_ID;
const auth0ClientSecret = process.env.AUTH_0_CLIENT_SECRET;
const auth0Audience = process.env.AUTH_0_AUDIENCE;
const auth0ManagementApiToken = process.env.AUTH_0_MANAGEMENT_API_TOKEN;
const auth0JwtPayloadNamespace = 'https://www.cityzen.fr';
const slackWebhookErrorUrl = process.env.SLACK_API_ERROR_WEBHOOK;
const env = process.env.NODE_ENV.trim();
const algoliaAppId = process.env.ALGOLIA_APP_ID;
const algoliaApiKey = process.env.ALGOLIA_API_KEY;
const algoliaEnv = process.env.ALGOLIA_ENV;
const filestackApiKey = process.env.FILE_STACK_API_KEY;
const filestackApiUrl = process.env.FILE_STACK_API_URL;
const filestackPolicy = process.env.FILE_STACK_POLICY;
const filestackSignature = process.env.FILE_STACK_SIGNATURE;
const defaultWallIcon = process.env.DEFAULT_WALL_ICON;
const defaultEventIcon = process.env.DEFAULT_EVENT_ICON;
const adminUsername = process.env.ADMIN_USERNAME;
const adminPassword = process.env.ADMIN_PASSWORD;
const adminAccessToken = process.env.ETERNAL_ADMIN_ACCESS_TOKEN;
const standardUsername = process.env.STANDARD_USERNAME;
const standardPassword = process.env.STANDARD_PASSWORD;
const standardAccessToken = process.env.ETERNAL_STANDARD_ACCESS_TOKEN;
const postgreSQLUser = process.env.POSTGRESQL_USER;
const postgreSQLHost = process.env.POSTGRESQL_HOST;
const postgreSQLDatabase = process.env.POSTGRESQL_DATABASE;
const postgreSQLPassword = process.env.POSTGRESQL_PASSWORD;
const postgreSQLPort = parseInt(process.env.POSTGRESQL_PORT, 10);

export default {
    server: {
        httpPort,
        env,
    },
    algolia: {
        algoliaAppId,
        algoliaApiKey,
        algoliaEnv,
        opts: {
            timeout: 1000,
        },
    },
    credentials: {
        adminUsername,
        adminPassword,
        adminAccessToken,
        standardUsername,
        standardPassword,
        standardAccessToken,
    },
    auth: {
        auth0url,
        auth0ClientId,
        auth0ClientSecret,
        auth0Audience,
        auth0ManagementApiToken,
        auth0JwtPayloadNamespace,
    },
    slack: {
        slackWebhookErrorUrl,
    },
    avatarIcon: {
        defaultWallIcon,
        defaultEventIcon,
    },
    filestack: {
        apiKey: filestackApiKey,
        apiUrl: filestackApiUrl,
        security: {
            // expire on april 2020, all right
            policy: filestackPolicy,
            signature: filestackSignature,
        },
    },
    test: {
        standardAuth0id: 'auth0|6',
    },
    postgreSQL: {
        user: postgreSQLUser,
        host: postgreSQLHost,
        database: postgreSQLDatabase,
        password: postgreSQLPassword,
        port: postgreSQLPort,
    },
};
