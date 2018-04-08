'use strict';

class Programmer {
	constructor(instance) {
		this.instance = instance;
		this.code = "";
		this.object = "";
		this.enabled = false;
		this.window = null;
	}
	
	setEnableHelper(value) {
		this.enabled = value;
	}
	
	setCode(code) {
		this.code = code;
		console.log("Code: " + this.code);
	}
	
	open() {
		this.window = window.open("./editor.html");
		setTimeout(() => {
			this.window.postMessage(this.code);
		}, 1000);
		window.addEventListener("message", data => {
			let code = data.data;
			this.sendCode(code);
		});
		
	}
	
	sendCode(data) {
		let lines = data.split("\n");
		this.instance.connection.send("@program " + this.object);
		for (let line of lines) {
			this.instance.connection.send(line);
		}
		this.instance.connection.send(".");
	}
	
	setObject(obj) {
		this.object = obj;
	}
	
}

module.exports = Programmer;