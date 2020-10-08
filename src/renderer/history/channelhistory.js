'use strict';
class ChannelHistory {
	constructor() {
		this.channels = new Array();
	}

	addMessage(pChannel, message) {
		let channel = this.getChannelByName(pChannel);
		if (channel == -1) {
			channel = new Channel(pChannel);
			this.channels.push(channel);
		}
		channel.addMessage(message);
	}

	getChannelByName(name) {
		for (const channel of this.channels) {
			if (channel.name == name) {
				return channel;
			}
		}
		return -1;
	}

	getMessageForChannel(name, id) {
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
		this.messages.unshift(message);
	}
}

module.exports = ChannelHistory;
