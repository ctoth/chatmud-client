'use strict';
class ChannelHistory {
	constructor() {
		this.channels = new Array();
	}

	addMessage(pChannel, message) {
		console.log('Adding to ' + pChannel + ', ' + message);
		let channel = this.getChannelByName(pChannel);
		if (channel == -1) {
			channel = new Channel(pChannel);
			this.channels.push(channel);
			console.log('Created new channel');
		}
		channel.addMessage(message);
	}

	getChannelByName(name) {
		console.log('Getting channel by name ' + name);
		for (const channel of this.channels) {
			if (channel.name == name) {
				return channel;
			}
		}
		return -1;
	}

	getMessageForChannel(name, id) {
		console.log('Getting message ' + id + ' for channel ' + name);
		const channel = this.getChannelByName(name);
		return channel.messages[id];
	}
}

class Channel {
	constructor(name) {
		this.name = name;
		this.messages = new Array();
	}

	addMessage(message) {
		console.log('In-channel message add: ' + message);
		this.messages.unshift(message);
	}
}

module.exports = ChannelHistory;
