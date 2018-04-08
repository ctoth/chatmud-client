'use strict';

class Programmer {
	constructor(instance) {
		this.instance = instance;
		this.code = "";
		this.object = "";
		this.enabled = false;
		this.window = null;
		this.lines = new Array();
		this.currentLine = 0;
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
		
		window.addEventListener("message", this.handleMessage.bind(this));
		
	}
	
	handleMessage(data) {
					let code = data.data;
					this.sendCode(code);
					window.removeEventListener("message", this.handleMessage.bind(this));
	}
	
	sendCode(data) {
		let lines = data.split("\n");
		this.lines = lines;
		this.instance.connection.send("@program " + this.object);
			for (let line of lines) {
				this.instance.connection.send(line);
			}
			this.instance.connection.send(".");
			this.code = "";
			this.enabled = false;
			
	}
	

	
	setObject(obj) {
		console.log("Object set to " + this.object);
		this.object = obj;
	}
	
}

module.exports = Programmer;