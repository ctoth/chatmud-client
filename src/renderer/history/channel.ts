export class Channel {
  name: any;
  messages: any[];
  constructor(name) {
    this.name = name;
    this.messages = [];
  }

  addMessage(message) {
    this.messages.unshift(message);
  }
}
