'use strict';
const webtts = require("./inserts/webtts");
const mcp = require("./inserts/mcp");
class InsertFactory {
	static getInsert(name) {
		switch(name) {
			case "webtts":
			return webtts;
			break;
			case "mcp":
			return mcp;
			break;
		}
		
	}
	
}

module.exports = InsertFactory;