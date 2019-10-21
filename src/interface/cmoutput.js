'use strict';
const EventEmitter = require('eventemitter3');

class CMOutput extends EventEmitter {
	constructor(instance) {
		super();
		this.instance = instance;
		this.maxLines = 100;
	}

	add(string) {
		if (string != '') {
			this.instance.tts.speak(string);
			this.emit('MudOutput', string);

			this.instance.history.addMessage('MudOutput', string);
		}
	}
}

module.exports = CMOutput;
