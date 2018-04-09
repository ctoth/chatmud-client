'use strict';
const webtts = require('./inserts/webtts');
const mcp = require('./inserts/mcp');
const triggers = require('./inserts/triggers');
const programmerhelper = require('./inserts/programmerhelper');

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
		}
	}
}

module.exports = InsertFactory;
