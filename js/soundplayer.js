const {Howl, Howler} = require('howler');
const soundops = require('./soundops');
const rng = require('random-int');
const Sounds = require('./sounds');

class SoundPlayer {
	constructor() {
		this.sounds = new Array();
		this.extension = '.ogg';
	}

	play(file, folder = '') {
		let mFile = this.searchSounds(file, folder);
		if (mFile == -1) {
			mFile = this.loadSound(file, folder);
		}
		mFile.sound.play();
	}

	playChannel(name) {
		const channels = soundops.findSoundsInFolder('channels');
		const foundChannels = soundops.findFilenames(name, channels);
		name = (foundChannels.length == 0 ? 'global' : name);
		this.play(name, 'channels');
	}

	playSocial(name, gender) {
		const socials = soundops.findSoundsInFolder('socials');
		let foundSocials = soundops.findFilenames(name + ' ' + gender, socials);
		if (foundSocials.length == 0) {
			foundSocials = soundops.findFilenames(name, socials);
		}
		let filename = null;
		if (foundSocials.length > 0) {
			filename = foundSocials[rng(0, foundSocials.length - 1)].toString();
			filename = filename.slice(0, filename.length - 4);
		}

		if (!filename) {
			return;
		}

		this.play(filename, 'socials');
	}

	searchSounds(file, folder) {
		for (const sound of this.sounds) {
			if (sound.file == file && sound.folder == folder) {
				return sound;
			}
		}
		return -1;
	}

	loadSound(file, folder) {
		const sound = new Sound(folder, file);
		this.sounds.push(sound);
		return sound;
	}
}

class Sound {
	constructor(folder, file) {
		this.basePath = './sounds/';
		this.file = file;
		this.folder = folder;
		this.extension = '.ogg';
		this.path = this.basePath + this.folder + '/' + this.file + this.extension;

		console.log('Loading ' + this.path);
		this.sound = new Howl({src: this.path});
	}
}

module.exports = SoundPlayer;
