export class AriaTTS {
  enabled = true;
  speaking = false;
  speakQueue: any[];
  voice: string;
  rate: number;
  constructor() {
    this.voice = 'alex';
    this.rate = 3;
  }

  stopSpeech() {
    const item = document.querySelector('#tts');
    item.innerHTML = '';
  }

  speakImmediate(string) {
    const item = document.querySelector('#tts');
    item.innerHTML = '';
    this.speak(string);
  }

  speak(string) {
    if (!this.enabled) {
      return;
    }
    string = string.replace('[', ' ');
    string = string.replace(']', ' ');

    const item = document.querySelector('#tts');
    const node = document.createTextNode(string + '\n');
    item.append(document.createElement('br'));
    item.append(node);
    setTimeout(this.stopSpeech.bind(this), 250);
  }
}
