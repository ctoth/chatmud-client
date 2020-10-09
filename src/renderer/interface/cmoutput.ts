import EventEmitter from 'eventemitter3';

export class CMOutput extends EventEmitter {
  constructor(instance) {
    super();
    this.instance = instance;
    this.maxLines = 100;
  }

  add(string) {
    if (string != '') {
      this.instance.tts.speak(string);
      this.emit('MudOutput', string);

      this.instance.history.addMessage('MudOutput', string);
    }
  }
}

export default CMOutput;
