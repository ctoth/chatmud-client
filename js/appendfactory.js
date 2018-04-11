'use strict';
const appends = {
};
class AppendFactory {
	static getInstance(instance) {
		return appends[instance];
	}
}

module.exports = AppendFactory;
