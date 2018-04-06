const {Howl, Howler} = require("howler");

class SoundPlayer {
	constructor() {
		this.sounds = new Array();
		this.extension = ".ogg";
	}
	
	play(file, folder = "") {
		let mFile = this.searchSounds(file, folder);
		if (mFile == -1) {
			mFile = this.loadSound(file, folder);
		}
		mFile.sound.play();
	}
	
	searchSounds(file, folder) {
		for (let sound of this.sounds) {
			if (sound.file == file && sound.folder == folder) return sound;
		}
		return -1;
	}
	
	loadSound(file, folder) {
		let sound = new Sound(folder, file);
		this.sounds.push(sound);
		return sound;
	}
	
	
}

class Sound {
	constructor(folder, file) {
		this.basePath = "./sounds/";
		this.file = file;
		this.folder = folder;
		this.extension = ".ogg";
		this.path = this.basePath + this.folder + "/" + this.file + this.extension;
		
		console.log("Loading " + this.path);
		this.sound = new Howl({src:this.path});
	}
	
}

module.exports = SoundPlayer;