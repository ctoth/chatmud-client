import { Insert } from './insert';

export class WebTTS implements Insert {
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
