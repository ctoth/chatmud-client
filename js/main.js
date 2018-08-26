'use strict';
const ChatMud = require('./chatmud.js');
// const TCPConnection = require('./tls.js');
const WebsocketConnection = require("./websockets");
const SoundPlayer = require('./soundplayer');

// AddEventListener("DOMContentLoaded", () => {
console.log('Starting connection...');
// const connection = new TCPConnection();
const connection = new WebsocketConnection();
console.log('Creating handler...');
const game = new ChatMud(connection);
// });
