'use strict';
const net = require('net');
const EventEmitter = require('eventemitter3');
const TLS = require("tls");

class TCPConnection extends EventEmitter {
	constructor(socket, address = '127.0.0.1', port = 7777) {
		console.log('Connecting to ' + address + ' on port ' + port + " for " + socket.handshake.address);
		super();
		this.address = address;
		this.port = port;
		this.client = new net.Socket();
		this.connection = this.client.connect(this.port, this.address, () => this.setupEvents());


		this.data = null;
	}

	disconnect() {
		this.connection.end();
// this.connection.close();
this.connection.destroy();
}

	setupEvents() {
		console.log('Setting up tcp events');
		// TODO: this.connection.write("Proxy stuff");
		this.connection.on('data', data => this.handleData(data));
	}

	handleData(data) {
	

		const string = data.toString();
		this.data += string;
		if (this.data.endsWith('\n')) {
			this.emitData(this.data);
			this.data = '';
		}
	}

	emitData(data) {
		const arr = data.split('\r\n');
		for (const i of arr) {
			this.emit('data', i);
		}
	}

	send(string) {
				this.connection.write(string);
	}
}

module.exports = TCPConnection;
