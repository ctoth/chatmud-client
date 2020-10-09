'use strict';
import IO from 'socket.io-client';
import { Connection } from './connection';

export class Websockets extends Connection {
  constructor() {
    super();
    this.io = new IO();
    this.setupEvents();
  }

  setupEvents() {
    this.io.on('data', data => this.handleData(data));
    this.io.emit('data', '\n');
  }

  send(string) {
    console.log(`Sending: ${string}`);
    this.io.emit('data', string + '\n');
  }
}
