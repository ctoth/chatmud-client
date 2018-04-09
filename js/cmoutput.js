'use strict';
class CMOutput {
	constructor(domNode, instance) {
		this.instance = instance;
		this.domNode = domNode;
		this.maxLines = 100;
	}

	add(string) {
		this.instance.tts.speak(string);
		const paragraph = document.createElement('p');
		const text = document.createTextNode(string);
		paragraph.appendChild(text);
		this.domNode.appendChild(paragraph);
		this.checkScreen();
	}

	checkScreen() {
		if (this.domNode.childNodes.length > this.maxLines) {
			// This.domNode.removeChild(this.domNode.firstChild);
		}
	}
}

module.exports = CMOutput;
