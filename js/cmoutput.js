'use strict';
const LinkEmbedder = require('./linkembedder.js');

class CMOutput {
	constructor(domNode, instance) {
		this.instance = instance;
		this.domNode = domNode;
		this.maxLines = 100;
		this.linkEmbedder = new LinkEmbedder();
	}

	add(string) {
		if (string != '') {
			this.instance.tts.speak(string);
			const paragraph = document.createElement('p');
			/*			Const text = document.createTextNode(string);
			paragraph.appendChild(text); */
			let processed = this.HTMLEscape(string);
			processed = this.linkEmbedder.act(processed);
			paragraph.innerHTML = processed;
			this.domNode.appendChild(paragraph);
			this.instance.history.addMessage('MudOutput', string);
		}

		this.checkScreen();
	}

	HTMLEscape(string) {
		    return string.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
	}

	addHTML(string) {

	}

	checkScreen() {
		if (this.domNode.childNodes.length > this.maxLines) {
			// This.domNode.removeChild(this.domNode.firstChild);
		}
	}
}

module.exports = CMOutput;
