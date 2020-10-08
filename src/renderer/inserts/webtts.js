'use strict';

class WebTTS {
	constructor() {
		this.interface = null;
	}

	act(string, instance) {
		this.instance = instance;
		console.log(document.getElementById('speechToggle').value);
		this.instance.tts.speak(string);
		return string;
	}
}

export default WebTTS;
