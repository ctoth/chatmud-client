import { Client } from '../client';

export class Insert {
  public instance: Client;

  constructor(instance) {
    this.instance = instance;
  }

  abstract act(text: string, instance: any): string;
}
