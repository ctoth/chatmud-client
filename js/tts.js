const say = require('say');

class TTS {
	constructor() {
		this.enabled = true;
		this.speaking = false;
		this.speakQueue = new Array();
		this.voice = 'alex';
		this.rate = 3.0;
	}

	stopSpeech() {
		if (this.speaking == true) {
			this.speaking = false;
			this.speakQueue = [];
			say.stop();
		}
	}

	speakImmediate(string) {
		if (this.speaking == true) {
			this.stopSpeech();
		}
					this.speak(string);
	}

	speak(string) {
		if (!this.enabled) {
			return;
		}
		string = string.replace('[', ' ');
		string = string.replace(']', ' ');
	console.log('saying ' + string);
	this.speakQueue.push(string);
	if (this.speaking == false) {
	this.handleQueue();
	this.speaking = true;
	}
	}

	handleQueue() {
		if (this.speakQueue.length > 0) {
			const string = this.speakQueue.shift();
			say.speak(string, this.voice, this.rate, err => this.handleQueue());
		} else {
			this.speaking = false;
		}
	}
}

module.exports = TTS;
