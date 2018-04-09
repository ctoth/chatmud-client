'use strict';
const Combokeys = require("combokeys");
class Interface {
	constructor(instance) {
		this.instance = instance;
		this.audioOptsToggle = document.getElementById('audioOptsToggle');
		this.audioOpts = document.getElementById('audioOpts');
		this.shortcuts = new Combokeys(window);
		require("combokeys/plugins/global-bind")(this.shortcuts);
		this.setupEvents();
		this.setupKeys();
	}
	
	setupKeys() {
		if (process.platform === 'win32') {
			this.shortcuts.bindGlobal('alt+left', () => this.instance.historyInterface.previousChannel());
			this.shortcuts.bindGlobal('alt+right', () => this.instance.historyInterface.nextChannel());
			this.shortcuts.bindGlobal('alt+up', () => this.instance.historyInterface.previousMessage());
			this.shortcuts.bindGlobal('alt+down', () => this.instance.historyInterface.nextMessage());
		} else {
			this.shortcuts.bindGlobal('alt+meta+left', () => this.instance.historyInterface.previousChannel());
			this.shortcuts.bindGlobal('alt+meta+right', () => this.instance.historyInterface.nextChannel());
			this.shortcuts.bindGlobal('alt+meta+up', () => this.instance.historyInterface.previousMessage());
			this.shortcuts.bindGlobal('alt+meta+down', () => this.instance.historyInterface.nextMessage());
		}
				this.shortcuts.bindGlobal('ctrl', () => this.instance.tts.stopSpeech());
		
	}
	
	setupEvents() {
		audioOptsToggle.addEventListener('click', () => {
			audioOptsToggle.setAttribute('aria-expanded', (audioOptsToggle.getAttribute('aria-expanded') == 'false' ? 'true' : 'false'));
			audioOpts.style.display = (audioOpts.style.display == 'none' ? '' : 'none');
		});
		document.getElementById('soundVolume').addEventListener('change', event => {
			console.log('Set volume to ' + event.target.value + ' percent');
			Howler.volume(Number(event.target.value) / 100);
		});
	
	}
	

}

module.exports = Interface;
