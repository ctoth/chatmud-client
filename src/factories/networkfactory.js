'use strict';

class NetworkFactory {
    static getInstance() {
        if (process.platform) {
            const TLS = require('../connection/tls');
            return TLS;
        } else {
            const Websockets = require('../connection/websockets');
            return Websockets;
        }
    }

}

module.exports = NetworkFactory;