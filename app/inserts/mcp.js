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
			case "authorization_key":
			this.key = args[0];
			break;
			case "my_name":
			this.name = args[0];
			break;
			case "channel_message":
			this.handleChannelMessage(args);
			break;
		}
		
	}
	
	handleChannelMessage(args) {
		this.instance.history.addMessage(args[0], args[2]+args[3]);
		this.instance.output.add(args[2]+args[3]);
		this.instance.soundPlayer.play(args[0], "channels");
	}
	
	
}

module.exports = MCP;