'use strict';
const ChatMud = require('./chatmud');
const NetworkFactory = require('./factories/networkfactory');
const SoundPlayer = require('./sounds/soundplayer');

console.log('Starting connection...');

const connection = NetworkFactory.getInstance();

console.log('Creating handler...');
const game = new ChatMud(new connection());