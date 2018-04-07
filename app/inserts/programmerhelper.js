class ProgrammerHelper {
	constructor() {
		this.code = "";
		this.receiving = false;
		this.instance = null;
	}
	
	act(string, instance) {
		if (this.enabled == true) {
					this.instance = instance;
		if (this.string == ".") {
			this.instance.programmer.setCode(this.code);
			this.instance.programmer.open();
		}
		this.code += string;
		}
		
	}
	
}

module.exports = ProgrammerHelper;