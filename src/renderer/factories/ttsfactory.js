'use strict';

import MacTTS from '../tts/mactts';
import AriaTTS from '../tts/ariatts';

class TTSFactory {
  static getInstance() {
    switch (process.platform) {
      case 'darwin':
        return new MacTTS();
        break;
      default:
        return new AriaTTS();
        break;
    }
  }
}

export default TTSFactory;
