'use strict';
const ChatMud = require('./chatmud');
const WebsocketConnection = require("./websockets");
const SoundPlayer = require('./sounds/soundplayer');

console.log('Starting connection...');

const connection = new WebsocketConnection();
console.log('Creating handler...');
const game = new ChatMud(connection);