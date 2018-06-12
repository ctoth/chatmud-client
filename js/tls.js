'use strict';
const net = require('net');
const EventEmitter = require('eventemitter3');
const TLS = require("tls");

class TCPConnection extends EventEmitter {
	constructor(address = 'chatmud.com', port = 3001) {
		console.log('Connecting to ' + address + ' on port ' + port);
		super();
		this.address = address;
		this.port = port;
		this.client = new net.Socket();
						this.tcp = this.client.connect(this.port, this.address);
		this.options ={
		socket: this.tcp,
		
		};

		this.connection = TLS.connect(this.options, () => this.setupEvents());
		this.data = null;
	}

	setupEvents() {
		console.log('Setting up tcp events');
		this.connection.on('data', data => this.handleData(data));
	}

	handleData(data) {
		console.log('TCP stream: ' + data);

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
		console.log('Sending ' + string);
		this.connection.write(string + '\n');
	}
}

module.exports = TCPConnection;
