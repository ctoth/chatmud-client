import { TLSConnection } from '../connection/tls';
import { Websockets } from '../connection/websockets';

export class NetworkFactory {
  static getInstance() {
    if (process.platform) {
      return TLSConnection;
    } else {
      return Websockets;
    }
  }
}
