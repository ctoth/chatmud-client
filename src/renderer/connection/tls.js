"use strict";
import net from "net";
import TLS from "tls";
import TCPConnection from "./tcp";

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

export default TLSConnection;
