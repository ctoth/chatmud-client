import EventEmitter from 'eventemitter3';
import { Client } from '../client';

export class CMOutput extends EventEmitter {
  instance: Client;
  maxLines = 100;
  constructor(instance: Client) {
    super();
    this.instance = instance;
  }

  add(string: string): void {
    if (string !== '') {
      this.instance.tts.speak(string);
      this.emit('MudOutput', string);

      this.instance.history.addMessage('MudOutput', string);
    }
  }
}
