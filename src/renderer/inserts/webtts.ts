'use strict';

class WebTTS {
  constructor() {
    this.interface = null;
  }

  act(string, instance) {
    this.instance = instance;
    console.log(document.querySelector('#speechToggle').value);
    this.instance.tts.speak(string);
    return string;
  }
}

export default WebTTS;
