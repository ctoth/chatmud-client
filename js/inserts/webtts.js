class WebTTS {
	constructor() {
		this.synth = window.speechSynthesis;
	}
	
	act(string) {
		const utterThis = new SpeechSynthesisUtterance(string);
		this.synth.speak(utterThis);
		return string;
	}
	
}

module.exports = WebTTS;