'use strict';
const ChatMud = require('./chatmud.js');
const TCPConnection = require('./tls.js');
const SoundPlayer = require('./soundplayer');

// AddEventListener("DOMContentLoaded", () => {
console.log('Starting connection...');
const connection = new TCPConnection();
console.log('Creating handler...');
const game = new ChatMud(connection);
// });
