'use strict';
class MCP {
	constructor() {
		this.instance = null;
		this.key = 0;
		this.name = 0;
	}
	
	act(string, instance) {
		string = string.toString();
		if (!string.startsWith("#$#")) {
			return string;
		}
		

		this.instance = instance;
		this.parse(string);
		return "";
	}
	
	parse(string) {
		console.log("Parsing " + string);
		let s1 = string.slice(3, string.length);
		let command = s1.slice(0, s1.indexOf(" "));
		s1 = s1.slice(command.length+1, s1.length);
		let key = s1.slice(s1.indexOf("-|-"), s1.length);
		s1 = s1.slice(0, s1.indexOf("-|-"));
		let s2 = s1.split("|");
		for (let i=0;i<s2.length;i++) {
			s2[i] = s2[i].trim();
		}
		
	
		
		if (command == "mcp") {
			this.initMCP();
		}
		
		this.executeMCP(command, s2, key);
	}
	
	initMCP() {
		this.instance.connection.send("#$#register_client ChatMud Official Client");
		this.instance.connection.send("#$#client_supports authkeys");
	}
	
	executeMCP(command, args, key) {
		switch (command) {
			case "authentication_key":
			this.key = args[0];
			break;
			case "my_name":
			this.name = args[0];
			break;
			case "channel_message":
			this.handleChannelMessage(args);
			break;
			case "channel_social":
			this.handleChannelSocial(args);
			break;
			case "social":
			this.handleSocial(args);
			break;

			case "watched_player_connect":
			this.handleConnect(args);
			break
			case "watched_player_reconnect":
			this.handlePlayerReconnect(args);
			break;
			case "watched_player_disconnect":
			this.handlePlayerDisconnect(args);
			break;
			case "teleport_out":
			this.handlePlayerTeleportOut(args);
			break;
			case "teleport_in":
			this.handlePlayerTeleportIn(args);
			break;
			case "tell_message":
			this.handleTell(args);
			break;
			
			default:
			this.handlePlay(command, args);
			break;
		}
		
	}
	
	handleChannelMessage(args) {
		this.instance.history.addMessage(args[0], args[2]+args[3]);
		this.instance.output.add(args[2]+args[3]);
		this.instance.soundPlayer.play(args[0], "channels");
	}
	
	handleChannelSocial(args) {
		console.log(JSON.stringify(args));
		this.instance.history.addMessage(args[0], args[0]+ + ": " + args[3]);
		this.instance.output.add(args[0]+": "+args[3]);
		this.instance.soundPlayer.playSocial(args[2], args[5]);
		this.instance.soundPlayer.play(args[0], "channels");
	}
	
	handleSocial(args) {
		this.instance.soundPlayer.playSocial(args[0], args[2]);
	}
	
	handlePlay(command, args) {
		this.instance.soundPlayer.play(args[0], command);
	}
	
	handlePlayerConnect(args) {
		this.instance.soundPlayer.play("enter");
		this.instance.output.add(args[0] + " connected");
	}
	
	handlePlayerReconnect(args) {
		this.instance.soundPlayer.play("reconnect");
		this.instance.output.add(args[0] + " reconnected");
	}
	
	handlePlayerDisconnect(args) {
		this.instance.soundPlayer.play("leave");
		this.instance.output.add(args[0] + " disconnected");
	}
	
	handlePlayerTeleportOut(args) {
		this.instance.soundPlayer.play("teleport%20out", "misc");
	}
	
	handlePlayerTeleportIn(args) {
		this.instance.soundPlayer.play("teleport%20in", "misc");
	}
	
	handleTell(args) {
		console.log("Parsed tell: " + args);
		this.instance.soundPlayer.play("tell");
		this.instance.output.add(args[0]+ " " + args[1] + " " + args[2]);
	}
	
}

module.exports = MCP;