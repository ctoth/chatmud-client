'use strict';

class TTSFactory {
    static getInstance() {
        switch(process.platform) {
            case 'darwin':
                const MacTTS = require('../tts/mactts');
                return new MacTTS();
                break;
            default:
                const AriaTTS = require('../tts/ariatts');
                return new AriaTTS();
                break;
        }
    }
}

module.exports = TTSFactory;