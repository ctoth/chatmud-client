const webtts = require("./inserts/webtts");

class InsertFactory {
	static getInsert(name) {
		switch(name) {
			case "webtts":
			return webtts;
			break;
		}
		
	}
	
}

module.exports = InsertFactory;