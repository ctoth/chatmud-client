'use strict';

import TLS from '../connection/tls';
import Websockets from '../connection/websockets';

class NetworkFactory {
    static getInstance() {
        if (process.platform) {
            return TLS;
        } else {
            return Websockets;
        }
    }

}

export default NetworkFactory;