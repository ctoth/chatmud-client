import IO from 'socket.io-client';
import { Connection } from './connection';

export class Websockets extends Connection {
  io: IO;
  constructor() {
    super();
    this.io = new IO();
    this.setupEvents();
  }

  setupEvents(): void {
    this.io.on('data', data => this.handleData(data));
    this.io.emit('data', '\n');
  }

  send(string: string): void {
    console.log(`Sending: ${string}`);
    this.io.emit('data', string + '\n');
  }
}
