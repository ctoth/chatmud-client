'use strict';
const IO = require("socket.io-client");
const EventEmitter = require("eventemitter3");

class Websockets extends EventEmitter {
	constructor() {
		super();
		this.io = new IO();
		this.setupEvents();
	}
	
	setupEvents() {
		this.io.on("data", data => this.handleData(data));
		this.io.emit('data', '\n');
	}
	
	handleData(data) {
		this.emit("data", data);
	}
	
	send(string) {
		console.log(`Sending: ${string}`);
		this.io.emit("data", string + "\n");
	}
}

module.exports = Websockets;