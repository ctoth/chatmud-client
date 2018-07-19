'use strict';

class TTS {
	constructor() {
		this.enabled = true;
		this.speaking = false;
		this.speakQueue = new Array();
		this.voice = 'alex';
		this.rate = 3.0;
	}

	stopSpeech() {
		let item = document.getElementById("tts");
        item.innerHTML = "";
	}

	speakImmediate(string) {
		let item = document.getElementById("tts");
		item.innerHTML = "";
		this.speak(string);
	}

	speak(string) {
		if (!this.enabled) {
			return;
		}
		string = string.replace('[', ' ');
		string = string.replace(']', ' ');
		console.log('saying ' + string);
        
		let item = document.getElementById("tts");
        let node = document.createTextNode(string+"\n");
		item.appendChild(document.createElement('br'));
        item.appendChild(node);
	}

	
}

module.exports = TTS;
