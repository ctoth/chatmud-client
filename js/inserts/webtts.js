'use strict';

class WebTTS {
	constructor() {
		this.interface = null;
	}
	
	act(string, instance) {
		this.instance = instance;
		this.instance.tts.speak(string);
		return string;
	}
	

	
}

module.exports = WebTTS;