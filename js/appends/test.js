'use strict';

class Test {
	constructor() {
		this.instance = null;
	}
	
	act(string, instance) {
		this.instance = instance;
		this.instance.soundPlayer.play("event");
	}
	
}

module.exports = Test;