const say = require("say");
const Combokeys = require("combokeys");
class TTS {
	constructor() {
		this.speaking = false;
		this.speakQueue = new Array();
		this.voice = "alex";
		this.rate = 3.0;
		this.combokeys = new Combokeys(document.documentElement);
		this.combokeys.bind("ctrl", () => this.stopSpeech());
	
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
		console.log(document.getElementById("speechToggle").value)
		if(!document.getElementById("speechToggle").checked) {
			return;
		}
		string = string.replace("[", " ");
		string = string.replace("]", " ");
	console.log("saying " + string);
	this.speakQueue.push(string);
	if (this.speaking == false) {
	this.handleQueue();
	this.speaking = true;
	}
	}
	
	handleQueue() {
		if (this.speakQueue.length > 0) {
			let string = this.speakQueue.shift();
			say.speak(string, this.voice, this.rate, (err) => this.handleQueue());
			
		} else {
			this.speaking = false;
		}
		
		
	}
}

module.exports =TTS;