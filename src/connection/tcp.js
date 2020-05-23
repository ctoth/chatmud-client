"use strict";
const net = require("net");
const Connection = require("./connection");

class TCPConnection extends Connection {
  constructor(address = "chatmud.com", port = 3000, encoding="latin1") {
    super();
    this.address = address;
    this.port = port;
    this.socket = new net.Socket();
    this.connection = this.setupConnection(this.setupEvents);
    this.data = null;
  }

  setupConnection(onComplete) {
    return this.socket.connect(this.port, this.address, onComplete);
  }

  setupEvents() {
    this.connection.on("data", (data) => this.handleData(data));
  }

  handleData(data) {
    const string = data.toString(this.encoding);
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
    const buf = Buffer.from(string, this.encoding);
    this.connection.write(buf);
  }
}

module.exports = TCPConnection;
