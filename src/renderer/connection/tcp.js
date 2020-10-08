"use strict";
import net from "net";
import Connection from "./connection";

class TCPConnection extends Connection {
  constructor(address = "chatmud.com", port = 7777, encoding="latin1") {
    super();
    this.encoding = encoding;
    this.address = address;
    this.port = port;
    this.socket = new net.Socket();
    this.connection = this.setupConnection(()=>this.setupEvents());
    this.data = '';
  }

  setupConnection(onComplete) {
    return this.socket.connect(this.port, this.address, onComplete);
  }

  setupEvents() {
    this.connection.on("data", (data) => this.handleTCPData(data));
  }

  handleTCPData(data) {
    const string = data.toString(this.encoding);
    this.emit('data', string);
  }

  send(string) {
    const buf = Buffer.from(string, this.encoding);
    this.connection.write(buf);
  }
}

export default TCPConnection;
