import { Client } from '../client';

export class Test {
  instance: Client;
  meow: any;
  hmm: any;

  constructor() {
    this.instance = undefined;
    this.meow = undefined;
    this.hmm = undefined;
  }

  act(string: string, instance: Client): void {
    this.instance = instance;
    this.instance.soundPlayer.play('event');
  }
}
