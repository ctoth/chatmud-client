"use strict";
const net = require("net");

const TLS = require("tls");
const TCPConnection = require("./tcp");

class TLSConnection extends TCPConnection {
  constructor(address = "chatmud.com", port = 7443) {
    super(address, port);
  }

  setupConnection() {
    super.setupConnection();
    const options = {
      socket: this.socket,
    };
    return TLS.connect(options, () => this.setupEvents());
  }
}

module.exports = TLSConnection;
