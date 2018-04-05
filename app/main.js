const ChatMud = require("./chatmud.js");
const TCPConnection = require("./tcp.js");
// import ChatMud from "./chatmud";
// import TCPConnection from "./tcp";
// addEventListener("DOMContentLoaded", () => {
	console.log("Starting connection...");
const connection = new TCPConnection();
console.log("Creating handler...");
const game = new ChatMud(connection);
// });