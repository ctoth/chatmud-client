const $ = require("nodobjc");


class MacSpeech {
	constructor() {
		$.framework("AppKit");
		
	}
	
}

module.exports = MacSpeech;