class ProgrammerHelper {
	constructor() {
		this.code = "";
		this.receiving = false;
		this.instance = null;
	}
	
	act(string, instance) {
		if (instance.programmer.enabled == true) {
					this.instance = instance;
					console.log("Checking: " + string);
		if (string == ".") {
			this.instance.programmer.setCode(this.code);
			this.instance.programmer.open();
			this.instance.programmer.setEnableHelper(false);
		}
		this.code += string + "\n";
		return "";
		} else {
			return string;
		}
		
		
	}
	
}

module.exports = ProgrammerHelper;