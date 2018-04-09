process.env.HMR_PORT=0;process.env.HMR_HOSTNAME="localhost";// modules are defined as an array
// [ module function, map of requires ]
//
// map of requires is short require name -> numeric require
//
// anything defined in a previous bundle is accessed via the
// orig method which is the require for previous bundles

// eslint-disable-next-line no-global-assign
parcelRequire = (function (modules, cache, entry) {
  // Save the require from previous bundle to this closure if any
  var previousRequire = typeof parcelRequire === 'function' && parcelRequire;
  var nodeRequire = typeof require === 'function' && require;

  function newRequire(name, jumped) {
    if (!cache[name]) {
      if (!modules[name]) {
        // if we cannot find the module within our internal map or
        // cache jump to the current global require ie. the last bundle
        // that was added to the page.
        var currentRequire = typeof parcelRequire === 'function' && parcelRequire;
        if (!jumped && currentRequire) {
          return currentRequire(name, true);
        }

        // If there are other bundles on this page the require from the
        // previous one is saved to 'previousRequire'. Repeat this as
        // many times as there are bundles until the module is found or
        // we exhaust the require chain.
        if (previousRequire) {
          return previousRequire(name, true);
        }

        // Try the node require function if it exists.
        if (nodeRequire && typeof name === 'string') {
          return nodeRequire(name);
        }

        var err = new Error('Cannot find module \'' + name + '\'');
        err.code = 'MODULE_NOT_FOUND';
        throw err;
      }

      localRequire.resolve = resolve;

      var module = cache[name] = new newRequire.Module(name);

      modules[name][0].call(module.exports, localRequire, module, module.exports);
    }

    return cache[name].exports;

    function localRequire(x){
      return newRequire(localRequire.resolve(x));
    }

    function resolve(x){
      return modules[name][1][x] || x;
    }
  }

  function Module(moduleName) {
    this.id = moduleName;
    this.bundle = newRequire;
    this.exports = {};
  }

  newRequire.isParcelRequire = true;
  newRequire.Module = Module;
  newRequire.modules = modules;
  newRequire.cache = cache;
  newRequire.parent = previousRequire;

  for (var i = 0; i < entry.length; i++) {
    newRequire(entry[i]);
  }

  // Override the current require with this new one
  return newRequire;
})({15:[function(require,module,exports) {
'use strict';
class CMOutput {
	constructor(domNode, instance) {
		this.instance = instance;
		this.domNode = domNode;
		this.maxLines = 100;
	}

	add(string) {
		this.instance.tts.speak(string);
		const paragraph = document.createElement('p');
		const text = document.createTextNode(string);
		paragraph.appendChild(text);
		this.domNode.appendChild(paragraph);
		this.checkScreen();
	}

	checkScreen() {
		if (this.domNode.childNodes.length > this.maxLines) {
			// This.domNode.removeChild(this.domNode.firstChild);
		}
	}
}

module.exports = CMOutput;

},{}],9:[function(require,module,exports) {
module.exports = ["mcp","triggers","programmerhelper"];
},{}],27:[function(require,module,exports) {
'use strict';

class WebTTS {
	constructor() {
		this.interface = null;
	}
	
	act(string, instance) {
		this.instance = instance;
		console.log(document.getElementById("speechToggle").value)
		this.instance.tts.speak(string);
		return string;
	}
	

	
}

module.exports = WebTTS;
},{}],28:[function(require,module,exports) {
'use strict';
class MCP {
	constructor() {
		this.instance = null;
		this.key = 0;
		this.name = 0;
	}
	
	act(string, instance) {
		string = string.toString();
		if (!string.startsWith("#$#")) {
			return string;
		}
		

		this.instance = instance;
		this.parse(string);
		return "";
	}
	
	parse(string) {
		console.log("Parsing " + string);
		let s1 = string.slice(3, string.length);
		s1 = s1.trim();
		let command = s1.slice(0, s1.indexOf(" "));
		
		command = command.trim();
		console.log("Command: " + command);
		s1 = s1.slice(command.length, s1.length);
		let key = null;
		if (s1.includes("-|-")) {
		key = s1.slice(s1.indexOf("-|-"), s1.length);
				s1 = s1.slice(0, s1.indexOf("-|-"));
		}
		

		let s2 = s1.split("|");
		for (let i=0;i<s2.length;i++) {
			s2[i] = s2[i].trim();
		}
	
		
		if (command == "mcp") {
			this.initMCP();
		}
		
		this.executeMCP(command, s2, key);
	}
	
	initMCP() {
		this.instance.connection.send("#$#register_client Chatmud Official Client (Alpha)");
		this.instance.connection.send("#$#client_supports authkeys");
	}
	
	executeMCP(command, args, key) {
		switch (command) {
			case "authentication_key":
			this.key = args[0];
			break;
			case "my_name":
			this.name = args[0];
			break;
			case "channel_message":
			this.handleChannelMessage(args);
			break;
			case "channel_social":
			this.handleChannelSocial(args);
			break;
			case "social":
			this.handleSocial(args);
			break;

			case "watched_player_connect":
			this.handlePlayerConnect(args);
			break
			case "watched_player_reconnect":
			this.handlePlayerReconnect(args);
			break;
			case "watched_player_disconnect":
			this.handlePlayerDisconnect(args);
			break;
			case "teleport_out":
			this.handlePlayerTeleportOut(args);
			break;
			case "teleport_in":
			this.handlePlayerTeleportIn(args);
			break;
			case "tell_message":
			this.handleTell(args);
			break;
			case "edit":
			this.handleEdit(args);
			break;
			default:
			this.handlePlay(command, args);
			break;
		}
		
	}
	
	handleChannelMessage(args) {
		this.instance.history.addMessage(args[0], args[2]+args[3]);
		this.instance.output.add(args[2]+" "+args[3]);
		this.instance.soundPlayer.playChannel(args[0]);
	}
	
	handleChannelSocial(args) {
		console.log(JSON.stringify(args));
		this.instance.history.addMessage(args[0], args[0]+ + ": " + args[3]);
		this.instance.output.add(args[0]+": "+args[3]);
		this.instance.soundPlayer.playSocial(args[2], args[5]);
		this.instance.soundPlayer.playChannel(args[0]);
	}
	
	handleSocial(args) {
		this.instance.soundPlayer.playSocial(args[0], args[2]);
	}
	
	handlePlay(command, args) {
		this.instance.soundPlayer.play(args[0], command);
	}
	
	handlePlayerConnect(args) {
		this.instance.soundPlayer.play("enter");
		this.instance.output.add(args[0] + " connected");
	}
	
	handlePlayerReconnect(args) {
		this.instance.soundPlayer.play("reconnect");
		this.instance.output.add(args[0] + " reconnected");
	}
	
	handlePlayerDisconnect(args) {
		this.instance.soundPlayer.play("leave");
		this.instance.output.add(args[0] + " disconnected");
	}
	
	handlePlayerTeleportOut(args) {
		this.instance.soundPlayer.play("teleport%20out", "misc");
	}
	
	handlePlayerTeleportIn(args) {
		this.instance.soundPlayer.play("teleport%20in", "misc");
	}
	
	handleTell(args) {
		console.log("Parsed tell: " + args);
		this.instance.soundPlayer.play("tell");
		this.instance.output.add(args[0]+ " " + args[1] + " " + args[2]);
	}
	
	handleEdit(args) {
			let args2 = args[0].split(" ");
			// console.log("Split args: " + JSON.stringify(args2));
			// let verb = args2[1].split(":")[1];
			// let object = args2[4].split(":")[0];
		this.instance.programmer.setObject(args2[args2.length-1]);
		this.instance.programmer.setEnableHelper(true);
	}
	
}

module.exports = MCP;
},{}],29:[function(require,module,exports) {
'use strict';

class Triggers {
	constructor() {
		this.instance = null;
	}
	
	act(string, instance) {
		this.instance = instance;
		this.executeTriggers(string);
		return string;
	}
	
	executeTriggers(string) {
		let matched = string.match("^Turning (off|on) channel ([a-zA-Z0-9]*)?\.");
		if (matched) {
			this.instance.soundPlayer.play(matched[1]);
		}
		
		matched = string.match("^I don't understand that\.$");
		if (matched) {
			this.instance.soundPlayer.play("huh", "misc");
		}
		
		matched = string.match("^(\>\> Command Aborted \<\<|Invalid selection.)$");
		if (matched) {
			this.instance.soundPlayer.play("cancel");
		}
		
		matched = string.match("(\\[(Type a line of input or `@abort' to abort the command|Type lines of input; use `\\.' to end or `@abort' to abort the command)\\.\\]|\\[Enter `yes' or `no'\\])");
		if (matched) {
			this.instance.soundPlayer.play("prompt");
		}
		
		matched = string.match("You click your heels three times.");
		if (matched) {
			this.instance.soundPlayer.play("home", "misc");
			
		}
		
		matched = string.match("[Connections] A new high player count has been reached! * players are connected.");
		if (matched) {
			this.instance.soundPlayer.play("high%connections", "misc");
		}
		
		matched = string.match("[Creation] * has just connected for the first time! Please make them feel welcome.");
		if (matched) {
			this.instance.soundPlayer.play("creation");
		}
		
		matched = string.match("(.*) says,(.*)");
		if (matched) {
			this.instance.soundPlayer.play("say");
		}
		
		matched = string.match("^You say,*?");
		if (matched) {
			this.instance.soundPlayer.play("say");
			
		}
		
		
	}
	
}

module.exports = Triggers;
},{}],30:[function(require,module,exports) {
class ProgrammerHelper {
	constructor() {
		this.code = "";
		this.receiving = false;
		this.instance = null;
	}
	
	act(string, instance) {
		if (instance.programmer.enabled == true) {
			if (this.receiving == false) {
				this.receiving = true;
				this.code = "";
			}
			
					this.instance = instance;
					console.log("Checking: " + string);
		if (string == ".") {
			this.instance.programmer.setCode(this.code);
			this.instance.programmer.open();
			this.instance.programmer.setEnableHelper(false);
			this.receiving = false;
		}
		this.code += string + "\n";
		return "";
		} else {
			return string;
		}
		
		
	}
	
}

module.exports = ProgrammerHelper;
},{}],10:[function(require,module,exports) {
'use strict';
const webtts = require('./inserts/webtts');
const mcp = require('./inserts/mcp');
const triggers = require('./inserts/triggers');
const programmerhelper = require('./inserts/programmerhelper');

class InsertFactory {
	static getInsert(name) {
		switch (name) {
			case 'webtts':
				return webtts;
				break;
			case 'mcp':
				return mcp;
				break;
			case 'triggers':
				return triggers;
				break;
			case 'programmerhelper':
				return programmerhelper;
				break;
		}
	}
}

module.exports = InsertFactory;

},{"./inserts/webtts":27,"./inserts/mcp":28,"./inserts/triggers":29,"./inserts/programmerhelper":30}],11:[function(require,module,exports) {
'use strict';
class ChannelHistory {
	constructor() {
		this.channels = new Array();
	}

	addMessage(pChannel, message) {
		console.log('Adding to ' + pChannel + ', ' + message);
		let channel = this.getChannelByName(pChannel);
		if (channel == -1) {
			channel = new Channel(pChannel);
			this.channels.push(channel);
			console.log('Created new channel');
		}
		channel.addMessage(message);
	}

	getChannelByName(name) {
		console.log('Getting channel by name ' + name);
		for (const channel of this.channels) {
			if (channel.name == name) {
				return channel;
			}
		}
		return -1;
	}

	getMessageForChannel(name, id) {
		console.log('Getting message ' + id + ' for channel ' + name);
		const channel = this.getChannelByName(name);
		return channel.messages[id];
	}
}

class Channel {
	constructor(name) {
		this.name = name;
		this.messages = new Array();
	}

	addMessage(message) {
		console.log('In-channel message add: ' + message);
		this.messages.unshift(message);
	}
}

module.exports = ChannelHistory;

},{}],12:[function(require,module,exports) {
'use strict';
const ChannelHistory = require('./channelhistory');
const Combokeys = require('combokeys');

class ChannelInterface {
	constructor(history, instance) {
		this.instance = instance;
		this.currentChannel = 0;
		this.currentMessage = 0;
		this.history = history;
		this.shortcuts = new Combokeys(window);
		this.setupKeys();
	}

	nextChannel() {
		console.log('Next channel');
		if (this.currentChannel < this.history.channels.length - 1) {
			this.currentChannel++;
		} else {
			this.currentChannel = this.history.channels.length - 1;
		}

		this.instance.tts.speakImmediate(this.history.channels[this.currentChannel].name);
	}

	previousChannel() {
		console.log('Previous channel');
		if (this.currentChannel > 0) {
			this.currentChannel--;
		} else {
			this.currentChannel = 0;
		}

				this.instance.tts.speakImmediate(this.history.channels[this.currentChannel].name);
	}

	nextMessage() {
		console.log('Next message');
		if (this.currentMessage > 0) {
			this.currentMessage--;
		} else {
			this.currentMessage = 0;
		}

		this.readMessage(this.currentMessage);
	}

	previousMessage() {
		console.log('Previous message');
		if (this.currentMessage < this.history.channels[this.currentChannel].messages.length - 1) {
			this.currentMessage++;
		} else {
			this.currentMessage = this.history.channels[this.currentChannel].messages.length - 1;
		}

		this.readMessage(this.currentMessage);
	}

	readMessage(id) {
		console.log('Reading ' + this.history.channels[this.currentChannel].messages[id]);
		this.instance.tts.speakImmediate(this.history.channels[this.currentChannel].messages[id]);
	}

	setupKeys() {
		if (process.platform === 'win32') {
			this.shortcuts.bind('alt+left', () => this.previousChannel());
			this.shortcuts.bind('alt+right', () => this.nextChannel());
			this.shortcuts.bind('alt+up', () => this.previousMessage());
			this.shortcuts.bind('alt+down', () => this.nextMessage());
		} else {
			this.shortcuts.bind('alt+meta+left', () => this.previousChannel());
			this.shortcuts.bind('alt+meta+right', () => this.nextChannel());
			this.shortcuts.bind('alt+meta+up', () => this.previousMessage());
			this.shortcuts.bind('alt+meta+down', () => this.nextMessage());
		}
	}
}

module.exports = ChannelInterface;

},{"./channelhistory":11}],25:[function(require,module,exports) {
module.exports = [{"type":"file","name":".DS_Store"},{"type":"file","name":"cancel.ogg"},{"type":"file","name":"dominion ship tell.ogg"},{"type":"file","name":"enter.ogg"},{"type":"file","name":"event.ogg"},{"type":"file","name":"leave linkdead.ogg"},{"type":"file","name":"leave.ogg"},{"type":"file","name":"off.ogg"},{"type":"file","name":"on.ogg"},{"type":"file","name":"prompt.ogg"},{"type":"file","name":"reconnected.ogg"},{"type":"file","name":"reply.ogg"},{"type":"file","name":"say.ogg"},{"type":"file","name":"tell.ogg"},{"type":"file","name":"whisper.ogg"},{"name":"admin","type":"folder","children":[{"type":"file","name":"administrators.ogg"},{"type":"file","name":"wizchange.ogg"}]},{"name":"casino","type":"folder","children":[{"type":"file","name":"slot_bet.ogg"},{"type":"file","name":"slot_lose.ogg"},{"type":"file","name":"slot_win.ogg"}]},{"name":"dragon","type":"folder","children":[{"type":"file","name":"eat.ogg"},{"type":"file","name":"flame.ogg"}]},{"name":"channels","type":"folder","children":[{"type":"file","name":".DS_Store"},{"type":"file","name":"announce.ogg"},{"type":"file","name":"botgames.ogg"},{"type":"file","name":"chat.ogg"},{"type":"file","name":"cp.ogg"},{"type":"file","name":"crazyparty.ogg"},{"type":"file","name":"creation.ogg"},{"type":"file","name":"dev.ogg"},{"type":"file","name":"games.ogg"},{"type":"file","name":"global.ogg"},{"type":"file","name":"haw.ogg"},{"type":"file","name":"im.ogg"},{"type":"file","name":"moderators.ogg"},{"type":"file","name":"newbie.ogg"},{"type":"file","name":"music.ogg"},{"type":"file","name":"news.ogg"},{"type":"file","name":"notify.ogg"},{"type":"file","name":"shout.ogg"},{"type":"file","name":"slej.ogg"},{"type":"file","name":"wily.ogg"},{"type":"file","name":"teamtalk.ogg"},{"type":"file","name":"wizards.ogg"}]},{"name":"games","type":"folder","children":[{"type":"file","name":"anagrams_end.ogg"},{"type":"file","name":"anagrams_invalid.ogg"},{"type":"file","name":"anagrams_start.ogg"},{"type":"file","name":"anagrams_valid.ogg"}]},{"name":"guns","type":"folder","children":[{"type":"file","name":"emptygun.ogg"},{"type":"file","name":"gun_drop.ogg"},{"type":"file","name":"gun_fired.ogg"},{"type":"file","name":"gun_load.ogg"},{"type":"file","name":"gun_silenced_fired.ogg"},{"type":"file","name":"gun_unload.ogg"},{"type":"file","name":"target_hit.ogg"},{"type":"file","name":"target_miss.ogg"},{"type":"file","name":"target_miss2.ogg"},{"type":"file","name":"target_miss3.ogg"},{"type":"file","name":"unwield_gun.ogg"},{"type":"file","name":"wield_gun.ogg"}]},{"name":"meow_button","type":"folder","children":[{"type":"file","name":".DS_Store"},{"type":"file","name":"meow.ogg"},{"type":"file","name":"press.ogg"},{"type":"file","name":"roll.ogg"}]},{"name":"misc","type":"folder","children":[{"type":"file","name":"high connections.ogg"},{"type":"file","name":"change.ogg"},{"type":"file","name":"home.ogg"},{"type":"file","name":"huh.ogg"},{"type":"file","name":"spoofer.ogg"},{"type":"file","name":"teleport in.ogg"},{"type":"file","name":"teleport out.ogg"}]},{"name":"pocketbubble","type":"folder","children":[{"type":"file","name":"bounce.ogg"},{"type":"file","name":"create.ogg"},{"type":"file","name":"pop.ogg"}]},{"name":"tv","type":"folder","children":[{"type":"file","name":"insult_off.ogg"},{"type":"file","name":"shot_off.ogg"},{"type":"file","name":"violent_social_off.ogg"}]},{"name":"socials","type":"folder","children":[{"type":"file","name":"Kick room.ogg"},{"type":"file","name":"Kick.ogg"},{"type":"file","name":"Kick10.ogg"},{"type":"file","name":"Kick11.ogg"},{"type":"file","name":"Kick12.ogg"},{"type":"file","name":"Kick13.ogg"},{"type":"file","name":"Kick14.ogg"},{"type":"file","name":"Kick15.ogg"},{"type":"file","name":"Kick16.ogg"},{"type":"file","name":"Kick17.ogg"},{"type":"file","name":"Kick18.ogg"},{"type":"file","name":"Kick19.ogg"},{"type":"file","name":"Kick2.ogg"},{"type":"file","name":"Kick20.ogg"},{"type":"file","name":"Kick3.ogg"},{"type":"file","name":"Kick4.ogg"},{"type":"file","name":"Kick5.ogg"},{"type":"file","name":"Kick6.ogg"},{"type":"file","name":"Kick7.ogg"},{"type":"file","name":"Kick8.ogg"},{"type":"file","name":"Kick9.ogg"},{"type":"file","name":"Kiss.ogg"},{"type":"file","name":"Poke me.ogg"},{"type":"file","name":"Punch10.ogg"},{"type":"file","name":"Punch11.ogg"},{"type":"file","name":"Punch12.ogg"},{"type":"file","name":"Punch13.ogg"},{"type":"file","name":"Punch14.ogg"},{"type":"file","name":"Punch15.ogg"},{"type":"file","name":"Punch16.ogg"},{"type":"file","name":"Punch18.ogg"},{"type":"file","name":"Punch17.ogg"},{"type":"file","name":"Punch19.ogg"},{"type":"file","name":"Punch2.ogg"},{"type":"file","name":"Punch20.ogg"},{"type":"file","name":"Punch3.ogg"},{"type":"file","name":"Punch4.ogg"},{"type":"file","name":"Punch5.ogg"},{"type":"file","name":"Punch6.ogg"},{"type":"file","name":"Punch7.ogg"},{"type":"file","name":"Punch8.ogg"},{"type":"file","name":"Punch9.ogg"},{"type":"file","name":"Slap2.ogg"},{"type":"file","name":"Slap3.ogg"},{"type":"file","name":"Slap4.ogg"},{"type":"file","name":"Slap5.ogg"},{"type":"file","name":"agree female101.ogg"},{"type":"file","name":"agree101.ogg"},{"type":"file","name":"apologize female101.ogg"},{"type":"file","name":"bark.ogg"},{"type":"file","name":"bored female101.ogg"},{"type":"file","name":"bored101.ogg"},{"type":"file","name":"brb101.ogg"},{"type":"file","name":"burp.ogg"},{"type":"file","name":"burp2.ogg"},{"type":"file","name":"cackle female.ogg"},{"type":"file","name":"cackle.ogg"},{"type":"file","name":"cheer female101.ogg"},{"type":"file","name":"chuckle female.ogg"},{"type":"file","name":"chuckle female101.ogg"},{"type":"file","name":"chuckle female102.ogg"},{"type":"file","name":"chuckle.ogg"},{"type":"file","name":"chuckle2.ogg"},{"type":"file","name":"clap.ogg"},{"type":"file","name":"coffee.ogg"},{"type":"file","name":"coke.ogg"},{"type":"file","name":"comfort female101.ogg"},{"type":"file","name":"comfort101.ogg"},{"type":"file","name":"confused female101.ogg"},{"type":"file","name":"cough female.ogg"},{"type":"file","name":"cough male.ogg"},{"type":"file","name":"cry female.ogg"},{"type":"file","name":"cry.ogg"},{"type":"file","name":"fart female.ogg"},{"type":"file","name":"fart.ogg"},{"type":"file","name":"flirt female101.ogg"},{"type":"file","name":"gasp female.ogg"},{"type":"file","name":"gasp.ogg"},{"type":"file","name":"giggle female.ogg"},{"type":"file","name":"giggle.ogg"},{"type":"file","name":"growl female.ogg"},{"type":"file","name":"growl female101.ogg"},{"type":"file","name":"growl female102.ogg"},{"type":"file","name":"growl.ogg"},{"type":"file","name":"hiss.ogg"},{"type":"file","name":"hmm female101.ogg"},{"type":"file","name":"hmm female102.ogg"},{"type":"file","name":"hmm female103.ogg"},{"type":"file","name":"hmm.ogg"},{"type":"file","name":"laugh female.ogg"},{"type":"file","name":"lol female101.ogg"},{"type":"file","name":"lol.ogg"},{"type":"file","name":"meow.ogg"},{"type":"file","name":"meow2.ogg"},{"type":"file","name":"meow3.ogg"},{"type":"file","name":"nudge me.ogg"},{"type":"file","name":"oic female101.ogg"},{"type":"file","name":"oic female102.ogg"},{"type":"file","name":"oic female103.ogg"},{"type":"file","name":"oic101.ogg"},{"type":"file","name":"okshut101.ogg"},{"type":"file","name":"okshut102.ogg"},{"type":"file","name":"paddle.ogg"},{"type":"file","name":"punch room.ogg"},{"type":"file","name":"punch.ogg"},{"type":"file","name":"purr.ogg"},{"type":"file","name":"rofl female.ogg"},{"type":"file","name":"rofl male.ogg"},{"type":"file","name":"scream female.ogg"},{"type":"file","name":"scream.ogg"},{"type":"file","name":"shove me.ogg"},{"type":"file","name":"shut101.ogg"},{"type":"file","name":"shutbuddy101.ogg"},{"type":"file","name":"sigh female.ogg"},{"type":"file","name":"sigh.ogg"},{"type":"file","name":"sit.ogg"},{"type":"file","name":"slap room.ogg"},{"type":"file","name":"slap.ogg"},{"type":"file","name":"snarl101.ogg"},{"type":"file","name":"snicker female101.ogg"},{"type":"file","name":"snicker.ogg"},{"type":"file","name":"sniff female.ogg"},{"type":"file","name":"sniff.ogg"},{"type":"file","name":"snore.ogg"},{"type":"file","name":"snort.ogg"},{"type":"file","name":"squeak.ogg"},{"type":"file","name":"stand.ogg"},{"type":"file","name":"tackle.ogg"},{"type":"file","name":"thank female101.ogg"},{"type":"file","name":"vomit.ogg"},{"type":"file","name":"yawn female.ogg"},{"type":"file","name":"yawn female101.ogg"},{"type":"file","name":"yawn male.ogg"}]},{"name":"clocks","type":"folder","children":[{"name":"bigben","type":"folder","children":[{"type":"file","name":"00.ogg"},{"type":"file","name":"15.ogg"},{"type":"file","name":"30.ogg"},{"type":"file","name":"45.ogg"},{"type":"file","name":"chime.ogg"}]},{"name":"grandfather","type":"folder","children":[{"type":"file","name":"chime.ogg"}]}]}]
;
},{}],17:[function(require,module,exports) {
const sounds = require('./sounds');

function findSoundsInFolder(path) {
	const split = path.split('/');
	let directory = sounds;
	for (const string of split) {
		directory = search(string, directory);
	}
	return directory;
}

function search(string, object) {
	for (const entry of object) {
		if (entry.name == string) {
			return entry.children;
		}
	}
}

function findFilenames(string, array) {
	const returnObj = [];
	for (const entry of array) {
		if (entry.name.includes(string)) {
returnObj.push(entry.name);
		}
	}
	return returnObj;
}

module.exports.findSoundsInFolder = findSoundsInFolder;
module.exports.findFilenames = findFilenames;

},{"./sounds":25}],5:[function(require,module,exports) {
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
		let filename = foundSocials[rng(0, foundSocials.length - 1)].toString();
		filename = filename.slice(0, filename.length - 4);
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

},{"./soundops":17,"./sounds":25}],13:[function(require,module,exports) {
'use strict';

class Programmer {
	constructor(instance) {
		this.instance = instance;
		this.code = '';
		this.object = '';
		this.enabled = false;
		this.window = null;
		this.lines = new Array();
		this.currentLine = 0;
	}

	setEnableHelper(value) {
		this.enabled = value;
	}

	setCode(code) {
		this.code = code;
		console.log('Code: ' + this.code);
	}

	open() {
		this.window = window.open('./editor.html');
		setTimeout(() => {
			this.window.postMessage(this.code);
		}, 1000);

		window.addEventListener('message', this.handleMessage.bind(this));
	}

	handleMessage(data) {
		const code = data.data;
					this.sendCode(code);
					window.removeEventListener('message', this.handleMessage.bind(this));
	}

	sendCode(data) {
		const lines = data.split('\n');
		this.lines = lines;
		this.instance.connection.send('@program ' + this.object);
		for (const line of lines) {
				this.instance.connection.send(line);
		}
			this.instance.connection.send('.');
			this.code = '';
			this.enabled = false;
	}

	setObject(obj) {
		console.log('Object set to ' + this.object);
		this.object = obj;
	}
}

module.exports = Programmer;

},{}],14:[function(require,module,exports) {
const say = require('say');
const Combokeys = require('combokeys');

class TTS {
	constructor() {
		this.speaking = false;
		this.speakQueue = new Array();
		this.voice = 'alex';
		this.rate = 3.0;
		this.combokeys = new Combokeys(window);
		this.combokeys.bind('ctrl', () => this.stopSpeech());
	}

	stopSpeech() {
		if (this.speaking == true) {
			this.speaking = false;
			this.speakQueue = [];
			say.stop();
		}
	}

	speakImmediate(string) {
		if (this.speaking == true) {
			this.stopSpeech();
		}
					this.speak(string);
	}

	speak(string) {
		console.log(document.getElementById('speechToggle').value);
		if (!document.getElementById('speechToggle').checked) {
			return;
		}
		string = string.replace('[', ' ');
		string = string.replace(']', ' ');
	console.log('saying ' + string);
	this.speakQueue.push(string);
	if (this.speaking == false) {
	this.handleQueue();
	this.speaking = true;
	}
	}

	handleQueue() {
		if (this.speakQueue.length > 0) {
			const string = this.speakQueue.shift();
			say.speak(string, this.voice, this.rate, err => this.handleQueue());
		} else {
			this.speaking = false;
		}
	}
}

module.exports = TTS;

},{}],35:[function(require,module,exports) {
class Interface {
	constructor(instance) {
		this.instance = instance;
		const audioOptsToggle = document.getElementById('audioOptsToggle');
		const audioOpts = document.getElementById('audioOpts');
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

},{}],3:[function(require,module,exports) {
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
		this.connection.send(string);
		this.input.value = '';
	}
}

module.exports = ChatMud;

},{"./cmoutput":15,"./inserts.json":9,"./insertfactory":10,"./channelhistory":11,"./channelinterface":12,"./soundplayer":5,"./programmer":13,"./tts":14,"./interface":35}],4:[function(require,module,exports) {
'use strict';
const net = require('net');
const EventEmitter = require('eventemitter3');

class TCPConnection extends EventEmitter {
	constructor(address = 'chatmud.com', port = 3000) {
		console.log('Connecting to ' + address + ' on port ' + port);
		super();
		this.address = address;
		this.port = port;
		this.client = new net.Socket();
		this.connection = this.client.connect(this.port, this.address, () => this.setupEvents());
	}

	setupEvents() {
		console.log('Setting up tcp events');
		this.client.on('data', data => this.handleData(data));
	}

	handleData(data) {
		console.log('TCP stream: ' + data);
		const string = data.toString();
		const arr = string.split('\r\n');
		for (const i of arr) {
		this.emit('data', i);
		}
	}

	send(string) {
		console.log('Sending ' + string);
		this.client.write(string + '\n');
	}
}

module.exports = TCPConnection;

},{}],1:[function(require,module,exports) {
'use strict';
const ChatMud = require('./chatmud.js');
const TCPConnection = require('./tcp.js');
const SoundPlayer = require('./soundplayer');

// AddEventListener("DOMContentLoaded", () => {
	console.log('Starting connection...');
const connection = new TCPConnection();
console.log('Creating handler...');
const game = new ChatMud(connection);
// });

},{"./chatmud.js":3,"./tcp.js":4,"./soundplayer":5}]},{},[1])
//# sourceMappingURL=/main.map