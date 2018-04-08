'use strict';
const ChatMud = require("./chatmud.js");
const TCPConnection = require("./tcp.js");
const SoundPlayer = require("./soundplayer");



// addEventListener("DOMContentLoaded", () => {
	console.log("Starting connection...");
const connection = new TCPConnection();
console.log("Creating handler...");
const game = new ChatMud(connection);
// });