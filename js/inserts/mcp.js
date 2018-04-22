const PingUtils = require('./pingutils');

'use strict';
class MCP {
	constructor() {
		this.instance = null;
		this.key = 0;
		this.name = 0;
		this.pings = new Array();
	}

	act(string, instance) {
		string = string.toString();
		if (!string.startsWith('#$#')) {
			return string;
		}

		this.instance = instance;
		if (string.startsWith('#$#json')) {
			try {
				string = string.slice(8, string.length);
				const parsed = JSON.parse(string);
				this.executeMCP(parsed.command, parsed.data, parsed.authentication_key);
			} catch (error) {
				this.instance.output.add('Error parsing MCP: ' + string);
			}
		} else {
					this.parse(string);
		}

		return '';
	}

	parse(string) {
		console.log('Parsing ' + string);
		let s1 = string.slice(3, string.length);
		s1 = s1.trim();
		let command = s1.slice(0, s1.indexOf(' '));

		command = command.trim();
		console.log('Command: ' + command);
		s1 = s1.slice(command.length, s1.length);
		let key = null;
		if (s1.includes('-|-')) {
			key = s1.slice(s1.indexOf('-|-') + 4, s1.length);
			key = key.trim();
			s1 = s1.slice(0, s1.indexOf('-|-'));
		}

		const s2 = s1.split('|');
		for (let i = 0; i < s2.length; i++) {
			s2[i] = s2[i].trim();
		}

		if (command == 'mcp') {
			this.initMCP();
		}

		this.executeMCP(command, s2, key);
	}

	initMCP() {
		this.instance.connection.send('#$#register_client Chatmud Official Client (Alpha)');
		this.instance.connection.send('#$#client_supports authkeys');
	this.instance.connection.send('#$#client_supports json');
	this.instance.connection.send('#$#client_supports check_netlag');
	}

	executeMCP(command, args, key) {
		if (key) {
			this.checkKey(key);
		}

		switch (command) {
			case 'authentication_key':
				this.key = args[0];
				this.instance.info.key = args[0];
				break;
			case 'my_name':
				this.name = args[0];
				this.instance.info.name = args[0];
				break;
			case 'channel_message':
			this.handleChannelMessage(args);
				break;
			case 'channel_social':
			this.handleChannelSocial(args);
				break;
			case 'social':
			this.handleSocial(args);
				break;

			case 'watched_player_connect':
			this.handlePlayerConnect(args);
				break;
			case 'watched_player_reconnect':
			this.handlePlayerReconnect(args);
				break;
			case 'watched_player_disconnect':
			this.handlePlayerDisconnect(args);
				break;
			case 'teleport_out':
			this.handlePlayerTeleportOut(args);
				break;
			case 'teleport_in':
			this.handlePlayerTeleportIn(args);
				break;
			case 'tell_message':
			this.handleTell(args);
				break;
			case 'edit':
			this.handleEdit(args);
				break;

			case 'netlag':
				this.handleNetLag(args);
				break;
			default:
			this.handlePlay(command, args);
				break;
		}
	}

	handleChannelMessage(args) {
		this.instance.history.addMessage(args[0], args[2] + args[3]);
		this.instance.output.add(args[2] + ' ' + args[3]);
		this.instance.soundPlayer.playChannel(args[0]);
	}

	handleChannelSocial(args) {
		console.log(JSON.stringify(args));
		this.instance.history.addMessage(args[0], args[0] + Number(': ') + args[3]);
		this.instance.output.add(args[0] + ': ' + args[3]);
		this.instance.soundPlayer.playSocial(args[2], args[5]);
		this.instance.soundPlayer.playChannel(args[0]);
	}

	handleSocial(args) {
		this.instance.soundPlayer.playSocial(args[0], args[2]);
	}

	handlePlay(command, args) {
		this.instance.soundPlayer.play(args[0], command);
	}

	handlePlayerConnect(args) {
		this.instance.soundPlayer.play('enter');
		this.instance.output.add(args[0] + ' connected');
	}

	handlePlayerReconnect(args) {
		this.instance.soundPlayer.play('reconnect');
		this.instance.output.add(args[0] + ' reconnected');
	}

	handlePlayerDisconnect(args) {
		this.instance.soundPlayer.play('leave');
		this.instance.output.add(args[0] + ' disconnected');
	}

	handlePlayerTeleportOut(args) {
		this.instance.soundPlayer.play('teleport%20out', 'misc');
	}

	handlePlayerTeleportIn(args) {
		this.instance.soundPlayer.play('teleport%20in', 'misc');
	}

	handleTell(args) {
		console.log('Parsed tell: ' + args);
		this.instance.soundPlayer.play('tell');
		this.instance.output.add(args[0] + ' ' + args[1] + ' ' + args[2]);
	}

	handleEdit(args) {
		const args2 = args[0].split(' ');
		// Console.log("Split args: " + JSON.stringify(args2));
		// let verb = args2[1].split(":")[1];
		// let object = args2[4].split(":")[0];
		this.instance.programmer.setObject(args2[args2.length - 1]);
		this.instance.programmer.setEnableHelper(true);
	}

	checkKey(key) {
		console.log('Checking ' + key + ' agains ' + this.key);
		if (key != this.key) {
			this.instance.soundPlayer.play('spoofer', 'misc');
			this.instance.output.add('Spoof attempt!');
		}
	}

	handleNetLag(args) {
		if (args[0] == 'ping') {
			const newPing = new PingUtils(args[1]);
			this.instance.connection.send('#$#netlag pong ' + args[1]);
			newPing.start();
			this.pings.push(newPing);
		}

		if (args[0] == 'pang') {
			const myPing = this.findPingByToken(args[1]);
			myPing.stop();
		}
	}

	findPingByToken(token) {
		for (const ping of this.pings) {
			if (ping.token == token) {
				return ping;
			}
		}
	}
}

module.exports = MCP;
