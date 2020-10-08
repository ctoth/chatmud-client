'use strict';
const ChatMud = require('./chatmud');
const NetworkFactory = require('./factories/networkfactory');
const SoundPlayer = require('./sounds/soundplayer');


const connection = NetworkFactory.getInstance();
const game = new ChatMud(new connection());