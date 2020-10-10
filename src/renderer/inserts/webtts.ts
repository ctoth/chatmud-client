import { Insert } from './insert';

export class WebTTS extends Insert {
  act(string, instance) {
    this.instance = instance;
    console.log(document.querySelector('#speechToggle').value);
    this.instance.tts.speak(string);
    return string;
  }
}
