'use strict';
import Combokeys from 'combokeys';
import React from 'react';
import reactDom from 'react-dom';
import MainUI from '../ui/main';

class Interface {
	constructor(instance) {
		this.instance = instance;
		this.shortcuts = new Combokeys(window);
		require('combokeys/plugins/global-bind')(this.shortcuts);
		this.setupEvents();
		this.setupKeys();
		this.setupInterface();
	}

	setupInterface() {
		reactDom.render(<MainUI instance={this.instance}/>, document.getElementById('app'));
		// reactDom.render(React.createElement("MainUI", {instance: this.instance}));
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
		this.shortcuts.bindGlobal('f12', () => this.setSpeechEnabled(!this.instance.tts.enabled));
	}

	setupEvents() {

	}

	setSpeechEnabled(state) {
		this.instance.tts.enabled = state;
		this.instance.output.add('Speech ' + (state ? 'enabled' : 'disabled'));
	}
}

export default Interface;