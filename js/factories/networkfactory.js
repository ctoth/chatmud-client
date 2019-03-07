'use strict';

const Websockets = require('../connection/websockets');
const TLS = require('../connection/tls');

class NetworkFactory {
    static getInstance() {
        if (typeof process !== 'undefined') {
return TLS;    
        } else {
                        return Websockets;
        }
    }

}

module.exports = NetworkFactory;