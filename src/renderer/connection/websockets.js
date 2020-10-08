"use strict";
const IO = require("socket.io-client");
const Connection = require("./connection");

class Websockets extends Connection {
  constructor() {
    super();
    this.io = new IO();
    this.setupEvents();
  }

  setupEvents() {
    this.io.on("data", (data) => this.handleData(data));
    this.io.emit("data", "\n");
  }

  send(string) {
    console.log(`Sending: ${string}`);
    this.io.emit("data", string + "\n");
  }
}

module.exports = Websockets;
