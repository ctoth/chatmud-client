"use strict";
const net = require("net");

const TLS = require("tls");
const TCPConnection = require("./tcp");

class TLSConnection extends TCPConnection {
  constructor(address = "chatmud.com", port = 7443) {
    super(address, port);
    this.options = {
      socket: this.socket,
    };

    this.connection = TLS.connect(this.options, () => this.setupEvents());
    this.data = null;
  }
}

module.exports = TLSConnection;
