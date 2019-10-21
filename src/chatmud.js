'use strict';
const CMOutput = require('./interface/cmoutput');
const Inserts = require('./inserts/inserts.json');
const InsertFactory = require('./factories/insertfactory');
const Appends = require('./appends/appends.json');
const AppendFactory = require('./factories/appendfactory');
const ChannelHistory = require('./history/channelhistory');
const ChannelInterface = require('./interface/channelinterface');
const SoundPlayer = require('./sounds/soundplayer');
const Programmer = require('./interface/programmer');
const TTSFactory = require('./factories/ttsfactory');
const Interface = require('./interface/interface');
const InputHistory = require('./history/inputhistory');
const ConfigManager = require('./config/config');
const AutoLogin = require('./config/autologin');

class ChatMud {
	constructor(connection) {
		this.output = new CMOutput(this);
		this.connection = connection;
		this.inserts = new Array();
		this.appends = new Array();
		this.history = new ChannelHistory();
		this.historyInterface = new ChannelInterface(this.history, this);
		this.inputHistory = new InputHistory();
		this.soundPlayer = new SoundPlayer();
		this.tts = TTSFactory.getInstance();

		this.configManager = new ConfigManager();
		this.autoLogin = new AutoLogin(this.configManager);
		this.interface = new Interface(this);
		this.programmer = new Programmer(this);
		this.info = {
			name: '',
			key: ''
		};

		this.setupEvents();
		this.setupInserts();
		this.setupAppends();
		this.handleAutoLogin();
	}

	handleAutoLogin() {
		setTimeout(() => {
			const loginData = this.autoLogin.get();
			if (loginData && loginData.username && loginData.password) {
				alert(`Automatically logging in`);
				this.connection.send(`connect ${loginData.username} ${loginData.password}`);
			}
		}, 1000);
	}

	setupEvents() {
		this.connection.on('data', data => this.handleData(data));
	}

	setupInserts() {
		for (const insertDef of Inserts) {
			const insert = InsertFactory.getInsert(insertDef);
			const instance = new insert();
			this.inserts.push(instance);
		}
	}

	setupAppends() {
		for (const appendDef of Appends) {
			const append = AppendFactory.getInstance(appendDef);
			const instance = new append();
			this.appends.push(instance);
		}
	}

	handleData(data) {
		for (const insert of this.inserts) {
			data = insert.act(data, this);
		}

		this.output.add(data);

		for (const append of this.appends) {
			append.act(data, this);
		}
	}

	sendInput() {
		let string = this.input.value;
		if (string == 'my_name') {
			this.output.add('Your name is set to ' + this.info.name);
		}
		this.output.add('Input history: ' + JSON.stringify(this.inputHistory.strings));
		if (string == '') {
			string = this.inputHistory.getLastEntered();
		} else if (string != this.inputHistory.getLastEntered()) {
			this.inputHistory.add(string);
		}

		this.connection.send(string);

		this.input.value = '';
	}
}

module.exports = ChatMud;
