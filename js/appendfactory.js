'use strict';
const test = require("./appends/test");
class AppendFactory {
	
	static getInstance(instance) {
		switch (instance) {
			case "test":
				return test;
				break;
		}
		
	}
	
}

module.exports = AppendFactory;