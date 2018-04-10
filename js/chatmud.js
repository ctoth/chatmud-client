'use strict';
const CMOutput = require('./cmoutput');
const Inserts = require('./inserts.json');
const InsertFactory = require('./insertfactory');
const ChannelHistory = require('./channelhistory');
const ChannelInterface = require('./channelinterface');
const SoundPlayer = require('./soundplayer');
const Programmer = require('./programmer');
const TTS = require('./tts');
const Interface = require('./interface');

class ChatMud {
	constructor(connection) {
		console.log('Constructing handler');
		this.input = document.getElementById('cm-input');
		this.output = new CMOutput(document.getElementById('cm-output'), this);
		this.connection = connection;
		this.inserts = new Array();
		this.history = new ChannelHistory();
		this.historyInterface = new ChannelInterface(this.history, this);
		this.soundPlayer = new SoundPlayer();
		this.tts = new TTS();
		this.interface = new Interface(this);
		this.programmer = new Programmer(this);
		this.info = {
			name: '',
			key: ''
		};

		this.setupEvents();
		this.setupInserts();
	}

	setupEvents() {
		console.log('Setting events');
		this.connection.on('data', data => this.handleData(data));
		this.input.addEventListener('keyup', event => {
			if (event.keyCode == 13) {
				this.tts.stopSpeech();
				this.sendInput();
			}
		});
	}

	setupInserts() {
		for (const insertDef of Inserts) {
			const insert = InsertFactory.getInsert(insertDef);
			const instance = new insert();
			this.inserts.push(instance);
		}
	}

	handleData(data) {
			console.log('Received data: ' + data);
			for (const insert of this.inserts) {
				data = insert.act(data, this);
			}

			this.output.add(data);
	}

	sendInput() {
		console.log('Handle enter key');

		const string = this.input.value;
		if (string == 'my_name') {
			this.output.add('Your name is set to ' + this.info.name);
		}

		this.connection.send(string);
		this.input.value = '';
	}
}

module.exports = ChatMud;
