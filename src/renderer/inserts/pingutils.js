'use strict';
class PingUtils {
	constructor(token) {
		this.token = token;
		this.time = 0;
	}

	start() {
		this.time = performance.now();
	}

	stop() {
		this.time = performance.now(); -this.time;
	}
}

module.exports = PingUtils;
