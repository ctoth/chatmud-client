'use strict';
const CMOutput = require("./cmoutput");
const Inserts = require("./inserts.json");
const InsertFactory = require("./insertfactory");

class ChatMud {
	constructor(connection) {
		console.log("Constructing handler");
		this.input = document.getElementById("cm-input");
		this.output = new CMOutput(document.getElementById("cm-output"));
		this.connection = connection;
		this.inserts = new Array();
		this.setupEvents();
		this.setupInserts();
	}
	
	setupEvents() {
		console.log("Setting events");
		this.connection.on("data", data => this.handleData(data));
		this.input.addEventListener("keyup", event => {
			if (event.keyCode == 13) {
				this.sendInput();
			}
			
		});
		
	}
	
	setupInserts() {
		for (let insertDef of Inserts) {
			let insert = InsertFactory.getInsert(insertDef);
			let instance = new insert();
			this.inserts.push(instance);
		}
		
	}
	
	
	
		handleData(data) {
			console.log("Received data: " + data);
			for (let insert of this.inserts) {
				data = insert.act(data);
			}
			
			this.output.add(data);
		}
		
		
	sendInput() {
		console.log("Handle enter key");

		let string = this.input.value;
		this.connection.send(string);
				this.input.value = "";
	}
	
}

module.exports = ChatMud;