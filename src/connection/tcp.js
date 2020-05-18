"use strict";
const net = require("net");
const Connection = require("./connection");

class TCPConnection extends Connection {
  constructor(address = "chatmud.com", port = 3000) {
    super();
    this.address = address;
    this.port = port;
    this.socket = new net.Socket();
    this.connection = this.setupConnection();
    this.data = null;
  }

  setupConnection() {
    return this.socket.connect(this.port, this.address, () =>
      this.setupEvents()
    );
  }

  setupEvents() {
    this.connection.on("data", (data) => this.handleData(data));
  }

  handleData(data) {
    const string = data.toString("latin1");
    this.data += string;
    if (this.data.endsWith("\n")) {
      const processed = this.processIncoming(this.data);
      this.emitData(processed);
      this.data = "";
    }
  }

  emitData(data) {
    const arr = data.split("\r\n");
    for (const i of arr) {
      this.emit("data", i);
    }
  }

  send(string) {
    const buf = Buffer.from(string + "\n", "latin1");
    this.connection.write(buf);
  }
}

module.exports = TCPConnection;
