'use strict';
import TLS from 'tls';
import { TCPConnection } from './tcp';

export class TLSConnection extends TCPConnection {
  constructor(address = 'chatmud.com', port = 7443) {
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
