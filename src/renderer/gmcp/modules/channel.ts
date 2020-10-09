import { Module } from './module';

export class Channel extends Module {
  constructor(instance) {
    super(instance);
    this.id = 'Comm.Channel';
  }

  Text(data) {
    this.instance.history.addMessage(data.channel, data.text);
  }
}
