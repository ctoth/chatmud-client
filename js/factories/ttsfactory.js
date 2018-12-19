'use strict';

const AriaTTS = require('../tts/ariatts');
const MacTTS = require('../tts/mactts');

class TTSFactory {
    static getInstance() {
        switch(process.platform) {
            case 'darwin':
                return new MacTTS();
                break;
            default:
                return new AriaTTS();
                break;
        }
    }
}

module.exports = TTSFactory;