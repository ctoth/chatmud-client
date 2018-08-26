'use strict';
const IO = require("socket.io-client");
const EventEmitter = require("eventemitter3");

class Websockets extends EventEmitter {
	constructor() {
		super();
		this.io = new IO("https://chatmud.com:3647");
		this.setupEvents();
	}
	
	setupEvents() {
		this.io.on("data", data => this.handleData(data));
	}
	
	handleData(data) {
		this.emit("data", data);
	}
	
	send(string) {
		this.io.emit("data", string + "\n");
	}
	
}

module.exports = Websockets;