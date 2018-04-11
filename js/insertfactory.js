'use strict';


const inserts={
	webtts: require('./inserts/webtts'),
	mcp: require('./inserts/mcp'),
	triggers: require('./inserts/triggers'),
	programmerhelper: require('./inserts/programmerhelper'),
	notifier: require('./inserts/notifier'),
}

class InsertFactory {
	static getInsert(name) {
		return inserts[name];
	}
}

module.exports = InsertFactory;
