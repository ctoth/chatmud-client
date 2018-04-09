'use strict';
const webtts = require('./inserts/webtts');
const mcp = require('./inserts/mcp');
const triggers = require('./inserts/triggers');
const programmerhelper = require('./inserts/programmerhelper');
const notifier = require("./inserts/notifier");
class InsertFactory {
	static getInsert(name) {
		switch (name) {
			case 'webtts':
				return webtts;
				break;
			case 'mcp':
				return mcp;
				break;
			case 'triggers':
				return triggers;
				break;
			case 'programmerhelper':
				return programmerhelper;
				break;
				case "notifier":
				return notifier;
				break;
		}
	}
}

module.exports = InsertFactory;
