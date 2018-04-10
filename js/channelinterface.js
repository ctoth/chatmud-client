'use strict';
const ChannelHistory = require('./channelhistory');

class ChannelInterface {
	constructor(history, instance) {
		this.instance = instance;
		this.currentChannel = 0;
		this.currentMessage = 0;
		this.history = history;
	}

	nextChannel() {
		console.log('Next channel');
		if (this.currentChannel < this.history.channels.length - 1) {
			this.currentChannel++;
		} else {
			this.currentChannel = this.history.channels.length - 1;
		}

		this.instance.tts.speakImmediate(this.history.channels[this.currentChannel].name);
	}

	previousChannel() {
		console.log('Previous channel');
		if (this.currentChannel > 0) {
			this.currentChannel--;
		} else {
			this.currentChannel = 0;
		}

				this.instance.tts.speakImmediate(this.history.channels[this.currentChannel].name);
	}

	nextMessage() {
		console.log('Next message');
		if (this.currentMessage > 0) {
			this.currentMessage--;
		} else {
			this.currentMessage = 0;
		}

		this.readMessage(this.currentMessage);
	}

	previousMessage() {
		console.log('Previous message');
		if (this.currentMessage < this.history.channels[this.currentChannel].messages.length - 1) {
			this.currentMessage++;
		} else {
			this.currentMessage = this.history.channels[this.currentChannel].messages.length - 1;
		}

		this.readMessage(this.currentMessage);
	}

	readMessage(id) {
		console.log('Reading ' + this.history.channels[this.currentChannel].messages[id]);
		this.instance.tts.speakImmediate(this.history.channels[this.currentChannel].messages[id]);
	}
}

module.exports = ChannelInterface;
