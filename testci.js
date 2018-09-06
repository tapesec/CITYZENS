#!/usr/bin/env node
var WebSocketClient = require('websocket').client;
var client = new WebSocketClient();

client.on('connectFailed', function(error) {
    console.log('Connect Error: ' + error.toString());
});

client.on('connect', function(connection) {
    console.log('WebSocket Client Connected');
    connection.on('error', function(error) {
        console.log('Connection Error: ' + error.toString());
    });
    connection.on('close', function(e) {
        console.log(e);
        console.log('echo-protocol Connection Closed');
        process.exit(1);
    });
    connection.on('message', function(message) {
        if (message.type === 'utf8') {
            console.log(message.utf8Data);
        }
        process.exit(0);
    });

    function auth() {
        if (connection.connected) {
            connection.sendUTF({
                message_type: 'oauth',
                authorization: '<oauth_header>',
            });
        }
    }
    auth();
});

// client.connect('wss://api.clever-cloud.com/v2/events/event-socket');
client.connect('wss://echo.websocket.org');
