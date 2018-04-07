'use strict';

class Programmer {
	constructor() {
		this.code = "";
		this.object = "";
		this.enabled = false;
	}
	
	setEnableHelper(value) {
		this.enabled = value;
	}
	
	setCode(code) {
		this.code = code;
		console.log("Code: " + this.code);
	}
	
	open() {
		
	}
	
	setObject(obj) {
		this.object = obj;
	}
	
}

module.exports = Programmer;