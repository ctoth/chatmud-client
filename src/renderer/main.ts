'use strict';
import ChatMud from './chatmud';
import NetworkFactory from './factories/networkfactory';
import SoundPlayer from './sounds/soundplayer';

const connection = NetworkFactory.getInstance();
const game = new ChatMud(new connection());
