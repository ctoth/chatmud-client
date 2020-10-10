import { Client } from '../client';
import { Insert } from './insert';

export class Notifier extends Insert {
  constructor(instance: Client) {
    super(instance);
    Notification.requestPermission().then(result =>
      console.log('Notification result: ' + result),
    );
  }

  act(string: string, instance: Client): string {
    string = string.toString();
    this.instance = instance;
    if (this.instance.info.name !== '') {
      if (string.includes(this.instance.info.name)) {
        console.log('Sending notification');
        const notification = new Notification('ChatMud', {
          body: "You've been mentioned! " + string,
        });
      }
    }
    return string;
  }
}
