'use strict';
const webtts = require('./inserts/webtts');
const mcp = require('./inserts/mcp');
const triggers = require('./inserts/triggers');
const programmerhelper = require('./inserts/programmerhelper');
const notifier = require('./inserts/notifier');
const linkEmbedder = require('./inserts/linkembed');

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
			case 'notifier':
				return notifier;
				break;
			case 'linkembedder':
				return linkEmbedder;
				break;
		}
	}
}

module.exports = InsertFactory;
