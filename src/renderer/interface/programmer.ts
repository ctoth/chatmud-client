import { Client } from '../client';

export class Programmer {
  instance: Client;
  code = '';
  object = '';
  enabled = false;
  window: any;
  lines: string[] = [];
  currentLine = 0;
  boundMethod: any;

  constructor(instance: Client) {
    this.instance = instance;
  }

  setEnableHelper(value: boolean): void {
    this.enabled = value;
  }

  setCode(code: string): void {
    this.code = code;
  }

  open(): void {
    this.window = window.open('editor.html');
    setTimeout(() => {
      this.window.postMessage(this.code);
    }, 1000);
    this.boundMethod = this.handleMessage.bind(this);
    window.addEventListener('message', this.boundMethod);
  }

  handleMessage(data): void {
    const code = data.data;
    this.sendCode(code);
    window.removeEventListener('message', this.boundMethod);
  }

  sendCode(data: string): void {
    const lines = data.split('\n');
    this.lines = lines;
    this.instance.connection.send('@program ' + this.object);
    for (const line of lines) {
      this.instance.connection.send(line);
    }
    this.instance.connection.send('.');
    this.code = '';
    this.enabled = false;
  }

  setObject(object: string): void {
    this.object = object;
  }
}
