'use strict';
class ProgrammerHelper {
	constructor() {
		this.code = '';
		this.receiving = false;
		this.instance = null;
	}

	act(string, instance) {
		if (instance.programmer.enabled == true) {
			if (this.receiving == false) {
				this.receiving = true;
				this.code = '';
			}

			this.instance = instance;
			console.log('Checking: ' + string);
			if (string == '.') {
				this.instance.programmer.setCode(this.code);
				this.instance.programmer.open();
				this.instance.programmer.setEnableHelper(false);
				this.receiving = false;
			}
			this.code += string + '\n';
			return '';
		}
		return string;
	}
}

module.exports = ProgrammerHelper;
