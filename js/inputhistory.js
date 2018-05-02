'use strict';

class InputHistory {
	constructor() {
		this.strings = [];
		this.iterator = 0;
	}
	
	add(string) {
		this.strings.unshift(string);
	}
	
	getLastEntered() {
		return this.strings[0];
	}
	
	getAtIndex(index) {
		return this.strings[index];
	}
	
	getAtIterator() {
		return this.strings[iterator];
	}
	
	increaseIterator() {
		this.iterator++;
		if (this.iterator > this.strings.length) {
			this.iterator = this.strings.length;
		}
		return this.iterator;
	}
	
	decreaseIterator() {
		this.iterator--;
		if (this.iterator < 0) {
			this.iterator = 0;
		}
		return this.iterator;
	}
	
}

module.exports = InputHistory;