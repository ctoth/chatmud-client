'use strict';
const webtts = require("./inserts/webtts");
const mcp = require("./inserts/mcp");
const triggers = require("./inserts/triggers");

class InsertFactory {
	static getInsert(name) {
		switch(name) {
			case "webtts":
			return webtts;
			break;
			case "mcp":
			return mcp;
			break;
			case "triggers":
			return triggers;
			break
			
		}
		
	}
	
}

module.exports = InsertFactory;