'use strict';
const IO = require("socket.io");
const EventEmitter = require("eventemitter3");
const TCP = require("./tcp");

class WebSockets extends EventEmitter {
	constructor(server) {
		console.log("Constructing websocket handler");
		super();
		this.io = new IO(server);
		this.setupEvents();
	}
	
	setupEvents() {
		console.log("Setting up main events");
		this.io.on("connection", socket => {
		console.log("Connection  from " + socket.ip);
			const tcpConnection = new TCP(socket, 'chatmud.com');
			socket.cmConnection = tcpConnection;
			socket.cmConnection.send("PROXY TCP4 " + socket.handshake.headers['x-forwarded-for'] + " 94.23.23.111 3647 3001");
			socket.cmConnection.on("data", data => this.handleTCPData(socket, data));
			socket.on("data", (data) => this.handleSocketData(socket, data));
			socket.on("disconnect", () => {
				console.log(socket);
				socket.cmConnection.disconnect();
			});
		});
		// this.io.listen(3647);
		console.log("Listening");
	}
	
	handleSocketData(socket, data) {
		console.log("Got socket data");
		socket.cmConnection.send(data);
	}
	
	handleTCPData(socket, data) {
		console.log("Got TCP data");
		socket.emit("data", data);
	}
	
}
module.exports = WebSockets;
