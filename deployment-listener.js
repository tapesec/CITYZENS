#!/usr/bin/env node
if (process.argv.length !== 4) throw new Error('Bad cmd parameter !');
const APP_NAME = process.argv[3];
const CLEVER_OAUTH_CONSUMER_KEY = process.env.CLEVER_OAUTH_CONSUMER_KEY;
const CLEVER_OAUTH_TOKEN = process.env.CLEVER_OAUTH_TOKEN;

var WebSocketClient = require('websocket').client;
var client = new WebSocketClient({ closeTimeout: 20000 });

client.on('connectFailed', function(error) {
    console.log('Connect Error: ' + error.toString());
});

client.on('connect', function(connection) {
    console.log('WebSocket Client Connected');
    connection.on('error', function(error) {
        console.log('Connection Error: ' + error.toString());
    });
    connection.on('close', function(reasonCode, description) {
        console.log(reasonCode, description);
        console.log('Connection Closed');
    });
    connection.on('message', function(message) {
        if (message.type === 'utf8' && message.utf8Data) {
            const parsedMessage = JSON.parse(message.utf8Data);
            const application = parsedMessage.application;
            if (parsedMessage.event) console.log(parsedMessage.event);
            if (
                application &&
                application.name === APP_NAME &&
                parsedMessage.event === 'DEPLOYMENT_SUCCESS'
            ) {
                console.log('Deployment finished successfully ! next step …');
                process.exit(0);
            }
            if (
                application &&
                application.name === APP_NAME &&
                parsedMessage.event === 'DEPLOYMENT_FAIL'
            ) {
                console.log('Deployment failed ! stop pipeline …');
                process.exit(1);
            }
        }
    });

    function auth() {
        if (connection.connected) {
            console.log('sending authentication request …');
            connection.send(
                JSON.stringify({
                    message_type: 'oauth',
                    authorization:
                        // `OAuth realm="https://api.clever-cloud.com/v2/oauth", oauth_consumer_key="JXE50BoFF4npvU0rMNheibuUhJfBiy", oauth_token="7b84005c644146c4857f02cc428d12f9", oauth_signature_method="HMAC-SHA512", oauth_signature="660hu/sPSAfeGQdFzD6Aue3C2pHfI/WnpvrG5+0DwG/l4LoTsYaXbzSMkwzqa7XF9/5F/qK/QQTqDml6TQTNQw==", oauth_timestamp="1536249082", oauth_nonce="978386"`
                        `OAuth realm="https://api.clever-cloud.com/v2/oauth", oauth_consumer_key="${CLEVER_OAUTH_CONSUMER_KEY}", oauth_token="${CLEVER_OAUTH_TOKEN}", oauth_signature_method="HMAC-SHA512", oauth_signature="660hu/sPSAfeGQdFzD6Aue3C2pHfI/WnpvrG5+0DwG/l4LoTsYaXbzSMkwzqa7XF9/5F/qK/QQTqDml6TQTNQw==", oauth_timestamp="1536249082", oauth_nonce="978386"`,
                }),
            );
            console.log('authentication request sended …');
        }
    }
    auth();
});

client.connect('wss://api.clever-cloud.com/v2/events/event-socket');
