process.env.HMR_PORT=8060;process.env.HMR_HOSTNAME="localhost";// modules are defined as an array
// [ module function, map of requires ]
//
// map of requires is short require name -> numeric require
//
// anything defined in a previous bundle is accessed via the
// orig method which is the require for previous bundles
parcelRequire = (function (modules, cache, entry, globalName) {
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
      localRequire.cache = {};

      var module = cache[name] = new newRequire.Module(name);

      modules[name][0].call(module.exports, localRequire, module, module.exports, this);
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
  newRequire.register = function (id, exports) {
    modules[id] = [function (require, module) {
      module.exports = exports;
    }, {}];
  };

  var error;
  for (var i = 0; i < entry.length; i++) {
    try {
      newRequire(entry[i]);
    } catch (e) {
      // Save first error but execute all entries
      if (!error) {
        error = e;
      }
    }
  }

  if (entry.length) {
    // Expose entry point to Node, AMD or browser globals
    // Based on https://github.com/ForbesLindesay/umd/blob/master/template.js
    var mainExports = newRequire(entry[entry.length - 1]);

    // CommonJS
    if (typeof exports === "object" && typeof module !== "undefined") {
      module.exports = mainExports;

    // RequireJS
    } else if (typeof define === "function" && define.amd) {
     define(function () {
       return mainExports;
     });

    // <script>
    } else if (globalName) {
      this[globalName] = mainExports;
    }
  }

  // Override the current require with this new one
  parcelRequire = newRequire;

  if (error) {
    // throw error from earlier, _after updating parcelRequire_
    throw error;
  }

  return newRequire;
})({"interface/cmoutput.js":[function(require,module,exports) {
'use strict';

const EventEmitter = require('eventemitter3');

class CMOutput extends EventEmitter {
  constructor(instance) {
    super();
    this.instance = instance;
    this.maxLines = 100;
  }

  add(string) {
    console.log('Outputting ' + string);

    if (string != '') {
      this.instance.tts.speak(string);
      this.emit('MudOutput', string);
      this.instance.history.addMessage('MudOutput', string);
    }
  }

}

module.exports = CMOutput;
},{}],"inserts/inserts.json":[function(require,module,exports) {
module.exports = ["mcp", "triggers", "programmerhelper"];
},{}],"inserts/webtts.js":[function(require,module,exports) {
'use strict';

class WebTTS {
  constructor() {
    this.interface = null;
  }

  act(string, instance) {
    this.instance = instance;
    console.log(document.getElementById('speechToggle').value);
    this.instance.tts.speak(string);
    return string;
  }

}

module.exports = WebTTS;
},{}],"inserts/pingutils.js":[function(require,module,exports) {
'use strict';

class PingUtils {
  constructor(token) {
    this.token = token;
    this.time = 0;
  }

  start() {
    this.time = performance.now();
  }

  stop() {
    this.time = performance.now();
    -this.time;
  }

}

module.exports = PingUtils;
},{}],"inserts/mcp.js":[function(require,module,exports) {
'use strict';

const PingUtils = require('./pingutils');

'use strict';

class MCP {
  constructor() {
    this.instance = null;
    this.key = 0;
    this.name = 0;
    this.pings = new Array();
  }

  act(string, instance) {
    string = string.toString();

    if (!string.startsWith('#$#')) {
      return string;
    }

    this.instance = instance;

    if (string.startsWith('#$#json')) {
      try {
        string = string.slice(8, string.length);
        const parsed = JSON.parse(string);
        this.executeMCP(parsed.command, parsed, parsed.authentication_key);
      } catch (error) {
        this.instance.output.add('Error parsing MCP: ' + string);
      }
    } else {
      this.parse(string);
    }

    return '';
  }

  parse(string) {
    console.log('Parsing ' + string);
    let s1 = string.slice(3, string.length);
    s1 = s1.trim();
    let command = s1.slice(0, s1.indexOf(' '));
    command = command.trim();
    console.log('Command: ' + command);
    s1 = s1.slice(command.length, s1.length);
    let key = null;

    if (s1.includes('-|-')) {
      key = s1.slice(s1.indexOf('-|-') + 4, s1.length);
      key = key.trim();
      s1 = s1.slice(0, s1.indexOf('-|-'));
    }

    const s2 = s1.split('|');

    for (let i = 0; i < s2.length; i++) {
      s2[i] = s2[i].trim();
    }

    if (command == 'mcp') {
      this.initMCP();
    }

    this.executeMCP(command, s2, key);
  }

  initMCP() {
    this.instance.connection.send('#$#register_client Chatmud Official Client (Alpha)');
    this.instance.connection.send('#$#client_supports authkeys');
    this.instance.connection.send('#$#client_supports json');
    this.instance.connection.send('#$#client_supports check_netlag');
  }

  executeMCP(command, args, key) {
    if (key) {
      this.checkKey(key);
    }

    switch (command) {
      case 'authentication_key':
        this.key = args[0];
        this.instance.info.key = args[0];
        break;

      case 'my_name':
        this.name = args[0];
        this.instance.info.name = args[0];
        break;

      case 'channel_message':
        this.handleChannelMessage(args);
        break;

      case 'channel_social':
        this.handleChannelSocial(args);
        break;

      case 'social':
        this.handleSocial(args);
        break;

      case 'watched_player_connect':
        this.handlePlayerConnect(args);
        break;

      case 'watched_player_reconnect':
        this.handlePlayerReconnect(args);
        break;

      case 'watched_player_disconnect':
        this.handlePlayerDisconnect(args);
        break;

      case 'teleport_out':
        this.handlePlayerTeleportOut(args);
        break;

      case 'teleport_in':
        this.handlePlayerTeleportIn(args);
        break;

      case 'tell_message':
        this.handleTell(args);
        break;

      case 'edit':
        this.handleEdit(args);
        break;

      case 'netlag':
        this.handleNetLag(args);
        break;

      default:
        this.handlePlay(command, args);
        break;
    }
  }

  handleChannelMessage(args) {
    this.instance.history.addMessage(args.name, args.prefix + args.message);
    this.instance.output.add(args.prefix + ' ' + args.message);
    this.instance.soundPlayer.playChannel(args.name);
  }

  handleChannelSocial(args) {
    console.log(JSON.stringify(args));
    this.instance.history.addMessage(args.name, args.name + ': ' + args.message);
    this.instance.output.add(args.name + ': ' + args.message);
    this.instance.soundPlayer.playSocial(args.social, args.gender);
    this.instance.soundPlayer.playChannel(args.name);
  }

  handleSocial(args) {
    this.instance.soundPlayer.playSocial(args.data[0], args.data[2]);
  }

  handlePlay(command, args) {
    if (args.data) {
      this.instance.soundPlayer.play(args.data[0], command);
    }
  }

  handlePlayerConnect(args) {
    this.instance.soundPlayer.play('enter');
    this.instance.output.add(args.data[0] + ' connected');
  }

  handlePlayerReconnect(args) {
    this.instance.soundPlayer.play('reconnect');
    this.instance.output.add(args[0] + ' reconnected');
  }

  handlePlayerDisconnect(args) {
    this.instance.soundPlayer.play('leave');
    this.instance.output.add(args.data[0] + ' disconnected');
  }

  handlePlayerTeleportOut(args) {
    this.instance.soundPlayer.play('teleport%20out', 'misc');
  }

  handlePlayerTeleportIn(args) {
    this.instance.soundPlayer.play('teleport%20in', 'misc');
  }

  handleTell(args) {
    console.log('Parsed tell: ' + args);
    this.instance.soundPlayer.play('tell');
    this.instance.output.add(args.data[0] + ' ' + args.data[1] + ' ' + args.data[2]);
  }

  handleEdit(args) {
    console.log(JSON.stringify(args));
    const args2 = args[0].split(' '); // Console.log("Split args: " + JSON.stringify(args2));
    // let verb = args2[1].split(":")[1];
    // let object = args2[4].split(":")[0];

    this.instance.programmer.setObject(args2[args2.length - 1]);
    this.instance.programmer.setEnableHelper(true);
  }

  checkKey(key) {
    console.log('Checking ' + key + ' agains ' + this.key);

    if (key != this.key) {
      this.instance.soundPlayer.play('spoofer', 'misc');
      this.instance.output.add('Spoof attempt!');
    }
  }

  handleNetLag(args) {
    if (args.data[0] == 'ping') {
      const newPing = new PingUtils(args.data[1]);
      this.instance.connection.send('#$#netlag pong ' + args.data[1]);
      newPing.start();
      this.pings.push(newPing);
    }

    if (args.data[0] == 'pang') {
      const myPing = this.findPingByToken(args.data[1]);
      myPing.stop();
    }
  }

  findPingByToken(token) {
    for (const ping of this.pings) {
      if (ping.token == token) {
        return ping;
      }
    }
  }

}

module.exports = MCP;
},{"./pingutils":"inserts/pingutils.js"}],"inserts/triggers.js":[function(require,module,exports) {
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
    let matched = string.match('^Turning (off|on) channel ([a-zA-Z0-9]*)?\.');

    if (matched) {
      this.instance.soundPlayer.play(matched[1]);
    }

    matched = string.match('^I don\'t understand that\.$');

    if (matched) {
      this.instance.soundPlayer.play('huh', 'misc');
    }

    matched = string.match('^(\>\> Command Aborted \<\<|Invalid selection.)$');

    if (matched) {
      this.instance.soundPlayer.play('cancel');
    }

    matched = string.match('(\\[(Type a line of input or `@abort\' to abort the command|Type lines of input; use `\\.\' to end or `@abort\' to abort the command)\\.\\]|\\[Enter `yes\' or `no\'\\])');

    if (matched) {
      this.instance.soundPlayer.play('prompt');
    }

    matched = string.match('You click your heels three times.');

    if (matched) {
      this.instance.soundPlayer.play('home', 'misc');
    }

    matched = string.match('[Connections] A new high player count has been reached! * players are connected.');

    if (matched) {
      this.instance.soundPlayer.play('high%connections', 'misc');
    }

    matched = string.match('[Creation] * has just connected for the first time! Please make them feel welcome.');

    if (matched) {
      this.instance.soundPlayer.play('creation');
    }

    matched = string.match('(.*) says,(.*)');

    if (matched) {
      this.instance.soundPlayer.play('say');
    }

    matched = string.match('^You say,*?');

    if (matched) {
      this.instance.soundPlayer.play('say');
    }
  }

}

module.exports = Triggers;
},{}],"inserts/programmerhelper.js":[function(require,module,exports) {
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
},{}],"inserts/notifier.js":[function(require,module,exports) {
'use strict';

class Notifier {
  constructor() {
    this.instance = null;
    Notification.requestPermission().then(result => console.log('Notification result: ' + result));
  }

  act(string, instance) {
    string = string.toString();
    this.instance = instance;

    if (this.instance.info.name != '') {
      if (string.includes(this.instance.info.name)) {
        console.log('Sending notification');
        new Notification('ChatMud', {
          body: 'You\'ve been mentioned! ' + string
        });
      }
    }

    return string;
  }

}

module.exports = Notifier;
},{}],"factories/insertfactory.js":[function(require,module,exports) {
'use strict';

const inserts = {
  webtts: require('../inserts/webtts'),
  mcp: require('../inserts/mcp'),
  triggers: require('../inserts/triggers'),
  programmerhelper: require('../inserts/programmerhelper'),
  notifier: require('../inserts/notifier')
};

class InsertFactory {
  static getInsert(name) {
    return inserts[name];
  }

}

module.exports = InsertFactory;
},{"../inserts/webtts":"inserts/webtts.js","../inserts/mcp":"inserts/mcp.js","../inserts/triggers":"inserts/triggers.js","../inserts/programmerhelper":"inserts/programmerhelper.js","../inserts/notifier":"inserts/notifier.js"}],"appends/appends.json":[function(require,module,exports) {
module.exports = [];
},{}],"factories/appendfactory.js":[function(require,module,exports) {
'use strict';

const appends = {};

class AppendFactory {
  static getInstance(instance) {
    return appends[instance];
  }

}

module.exports = AppendFactory;
},{}],"history/channelhistory.js":[function(require,module,exports) {
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
},{}],"interface/channelinterface.js":[function(require,module,exports) {
'use strict';

const ChannelHistory = require('../history/channelhistory');

class ChannelInterface {
  constructor(history, instance) {
    this.instance = instance;
    this.currentChannel = 0;
    this.currentMessage = 0;
    this.history = history;
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

}

module.exports = ChannelInterface;
},{"../history/channelhistory":"history/channelhistory.js"}],"sounds/sounds.json":[function(require,module,exports) {
module.exports = [{
  "type": "file",
  "name": ".DS_Store"
}, {
  "type": "file",
  "name": "cancel.ogg"
}, {
  "type": "file",
  "name": "dominion ship tell.ogg"
}, {
  "type": "file",
  "name": "enter.ogg"
}, {
  "type": "file",
  "name": "event.ogg"
}, {
  "type": "file",
  "name": "leave linkdead.ogg"
}, {
  "type": "file",
  "name": "leave.ogg"
}, {
  "type": "file",
  "name": "off.ogg"
}, {
  "type": "file",
  "name": "on.ogg"
}, {
  "type": "file",
  "name": "prompt.ogg"
}, {
  "type": "file",
  "name": "reconnected.ogg"
}, {
  "type": "file",
  "name": "reply.ogg"
}, {
  "type": "file",
  "name": "say.ogg"
}, {
  "type": "file",
  "name": "tell.ogg"
}, {
  "type": "file",
  "name": "whisper.ogg"
}, {
  "name": "admin",
  "type": "folder",
  "children": [{
    "type": "file",
    "name": "administrators.ogg"
  }, {
    "type": "file",
    "name": "wizchange.ogg"
  }]
}, {
  "name": "casino",
  "type": "folder",
  "children": [{
    "type": "file",
    "name": "slot_bet.ogg"
  }, {
    "type": "file",
    "name": "slot_lose.ogg"
  }, {
    "type": "file",
    "name": "slot_win.ogg"
  }]
}, {
  "name": "channels",
  "type": "folder",
  "children": [{
    "type": "file",
    "name": "announce.ogg"
  }, {
    "type": "file",
    "name": "botgames.ogg"
  }, {
    "type": "file",
    "name": "chat.ogg"
  }, {
    "type": "file",
    "name": "cp.ogg"
  }, {
    "type": "file",
    "name": "crazyparty.ogg"
  }, {
    "type": "file",
    "name": "creation.ogg"
  }, {
    "type": "file",
    "name": "dev.ogg"
  }, {
    "type": "file",
    "name": "devlog.ogg"
  }, {
    "type": "file",
    "name": "games.ogg"
  }, {
    "type": "file",
    "name": "global.ogg"
  }, {
    "type": "file",
    "name": "haw.ogg"
  }, {
    "type": "file",
    "name": "im.ogg"
  }, {
    "type": "file",
    "name": "kittycat.ogg"
  }, {
    "type": "file",
    "name": "moderators.ogg"
  }, {
    "type": "file",
    "name": "music.ogg"
  }, {
    "type": "file",
    "name": "newbie.ogg"
  }, {
    "type": "file",
    "name": "news.ogg"
  }, {
    "type": "file",
    "name": "notify.ogg"
  }, {
    "type": "file",
    "name": "program.ogg"
  }, {
    "type": "file",
    "name": "slej.ogg"
  }, {
    "type": "file",
    "name": "shout.ogg"
  }, {
    "type": "file",
    "name": "teamtalk.ogg"
  }, {
    "type": "file",
    "name": "wily.ogg"
  }, {
    "type": "file",
    "name": "wizards.ogg"
  }]
}, {
  "name": "dragon",
  "type": "folder",
  "children": [{
    "type": "file",
    "name": "eat.ogg"
  }, {
    "type": "file",
    "name": "flame.ogg"
  }]
}, {
  "name": "games",
  "type": "folder",
  "children": [{
    "type": "file",
    "name": "anagrams_end.ogg"
  }, {
    "type": "file",
    "name": "anagrams_invalid.ogg"
  }, {
    "type": "file",
    "name": "anagrams_start.ogg"
  }, {
    "type": "file",
    "name": "anagrams_valid.ogg"
  }]
}, {
  "name": "meow_button",
  "type": "folder",
  "children": [{
    "type": "file",
    "name": "meow.ogg"
  }, {
    "type": "file",
    "name": "press.ogg"
  }, {
    "type": "file",
    "name": "roll.ogg"
  }]
}, {
  "name": "guns",
  "type": "folder",
  "children": [{
    "type": "file",
    "name": "emptygun.ogg"
  }, {
    "type": "file",
    "name": "gun_drop.ogg"
  }, {
    "type": "file",
    "name": "gun_fired.ogg"
  }, {
    "type": "file",
    "name": "gun_load.ogg"
  }, {
    "type": "file",
    "name": "gun_silenced_fired.ogg"
  }, {
    "type": "file",
    "name": "gun_unload.ogg"
  }, {
    "type": "file",
    "name": "target_hit.ogg"
  }, {
    "type": "file",
    "name": "target_miss.ogg"
  }, {
    "type": "file",
    "name": "target_miss2.ogg"
  }, {
    "type": "file",
    "name": "target_miss3.ogg"
  }, {
    "type": "file",
    "name": "unwield_gun.ogg"
  }, {
    "type": "file",
    "name": "wield_gun.ogg"
  }]
}, {
  "name": "misc",
  "type": "folder",
  "children": [{
    "type": "file",
    "name": "change.ogg"
  }, {
    "type": "file",
    "name": "high connections.ogg"
  }, {
    "type": "file",
    "name": "huh.ogg"
  }, {
    "type": "file",
    "name": "home.ogg"
  }, {
    "type": "file",
    "name": "spoofer.ogg"
  }, {
    "type": "file",
    "name": "teleport in.ogg"
  }, {
    "type": "file",
    "name": "teleport out.ogg"
  }]
}, {
  "name": "pocketbubble",
  "type": "folder",
  "children": [{
    "type": "file",
    "name": "bounce.ogg"
  }, {
    "type": "file",
    "name": "create.ogg"
  }, {
    "type": "file",
    "name": "pop.ogg"
  }]
}, {
  "name": "tv",
  "type": "folder",
  "children": [{
    "type": "file",
    "name": "insult_off.ogg"
  }, {
    "type": "file",
    "name": "shot_off.ogg"
  }, {
    "type": "file",
    "name": "violent_social_off.ogg"
  }]
}, {
  "name": "socials",
  "type": "folder",
  "children": [{
    "type": "file",
    "name": "Kiss.ogg"
  }, {
    "type": "file",
    "name": "Poke.ogg"
  }, {
    "type": "file",
    "name": "agree_female_101.ogg"
  }, {
    "type": "file",
    "name": "agree_male_101.ogg"
  }, {
    "type": "file",
    "name": "apologize_female_101.ogg"
  }, {
    "type": "file",
    "name": "bark.ogg"
  }, {
    "type": "file",
    "name": "bored_female_101.ogg"
  }, {
    "type": "file",
    "name": "bored_male_101.ogg"
  }, {
    "type": "file",
    "name": "brb_101.ogg"
  }, {
    "type": "file",
    "name": "burp.ogg"
  }, {
    "type": "file",
    "name": "burp2.ogg"
  }, {
    "type": "file",
    "name": "cackle_female.ogg"
  }, {
    "type": "file",
    "name": "cackle_male.ogg"
  }, {
    "type": "file",
    "name": "cheer_female_101.ogg"
  }, {
    "type": "file",
    "name": "chuckle female101.ogg"
  }, {
    "type": "file",
    "name": "chuckle female102.ogg"
  }, {
    "type": "file",
    "name": "chuckle_female.ogg"
  }, {
    "type": "file",
    "name": "chuckle_male_1.ogg"
  }, {
    "type": "file",
    "name": "chuckle_male_2.ogg"
  }, {
    "type": "file",
    "name": "clap.ogg"
  }, {
    "type": "file",
    "name": "coffee.ogg"
  }, {
    "type": "file",
    "name": "coke.ogg"
  }, {
    "type": "file",
    "name": "comfort_female_101.ogg"
  }, {
    "type": "file",
    "name": "comfort_male_101.ogg"
  }, {
    "type": "file",
    "name": "confused_female_101.ogg"
  }, {
    "type": "file",
    "name": "cough male.ogg"
  }, {
    "type": "file",
    "name": "cough_female.ogg"
  }, {
    "type": "file",
    "name": "cry_female.ogg"
  }, {
    "type": "file",
    "name": "cry_male.ogg"
  }, {
    "type": "file",
    "name": "fart_female.ogg"
  }, {
    "type": "file",
    "name": "fart_male.ogg"
  }, {
    "type": "file",
    "name": "flirt_female_101.ogg"
  }, {
    "type": "file",
    "name": "gasp_female.ogg"
  }, {
    "type": "file",
    "name": "gasp_male.ogg"
  }, {
    "type": "file",
    "name": "giggle_female.ogg"
  }, {
    "type": "file",
    "name": "giggle_male.ogg"
  }, {
    "type": "file",
    "name": "growl female101.ogg"
  }, {
    "type": "file",
    "name": "growl female102.ogg"
  }, {
    "type": "file",
    "name": "growl_female.ogg"
  }, {
    "type": "file",
    "name": "growl_male.ogg"
  }, {
    "type": "file",
    "name": "hiss.ogg"
  }, {
    "type": "file",
    "name": "hmm female102.ogg"
  }, {
    "type": "file",
    "name": "hmm female103.ogg"
  }, {
    "type": "file",
    "name": "hmm_female_101.ogg"
  }, {
    "type": "file",
    "name": "hmm_male.ogg"
  }, {
    "type": "file",
    "name": "kick room.ogg"
  }, {
    "type": "file",
    "name": "kick.ogg"
  }, {
    "type": "file",
    "name": "kick10.ogg"
  }, {
    "type": "file",
    "name": "kick11.ogg"
  }, {
    "type": "file",
    "name": "kick12.ogg"
  }, {
    "type": "file",
    "name": "kick13.ogg"
  }, {
    "type": "file",
    "name": "kick14.ogg"
  }, {
    "type": "file",
    "name": "kick15.ogg"
  }, {
    "type": "file",
    "name": "kick16.ogg"
  }, {
    "type": "file",
    "name": "kick17.ogg"
  }, {
    "type": "file",
    "name": "kick18.ogg"
  }, {
    "type": "file",
    "name": "kick19.ogg"
  }, {
    "type": "file",
    "name": "kick2.ogg"
  }, {
    "type": "file",
    "name": "kick20.ogg"
  }, {
    "type": "file",
    "name": "kick3.ogg"
  }, {
    "type": "file",
    "name": "kick4.ogg"
  }, {
    "type": "file",
    "name": "kick5.ogg"
  }, {
    "type": "file",
    "name": "kick6.ogg"
  }, {
    "type": "file",
    "name": "kick7.ogg"
  }, {
    "type": "file",
    "name": "kick8.ogg"
  }, {
    "type": "file",
    "name": "kick9.ogg"
  }, {
    "type": "file",
    "name": "laugh_female.ogg"
  }, {
    "type": "file",
    "name": "lol_female_101.ogg"
  }, {
    "type": "file",
    "name": "lol_male.ogg"
  }, {
    "type": "file",
    "name": "meow.ogg"
  }, {
    "type": "file",
    "name": "meow2.ogg"
  }, {
    "type": "file",
    "name": "meow3.ogg"
  }, {
    "type": "file",
    "name": "nudge.ogg"
  }, {
    "type": "file",
    "name": "oic female102.ogg"
  }, {
    "type": "file",
    "name": "oic female103.ogg"
  }, {
    "type": "file",
    "name": "oic_female_101.ogg"
  }, {
    "type": "file",
    "name": "oic_male_101.ogg"
  }, {
    "type": "file",
    "name": "okshut_101.ogg"
  }, {
    "type": "file",
    "name": "okshut_102.ogg"
  }, {
    "type": "file",
    "name": "paddle.ogg"
  }, {
    "type": "file",
    "name": "punch room.ogg"
  }, {
    "type": "file",
    "name": "punch.ogg"
  }, {
    "type": "file",
    "name": "punch10.ogg"
  }, {
    "type": "file",
    "name": "punch11.ogg"
  }, {
    "type": "file",
    "name": "punch12.ogg"
  }, {
    "type": "file",
    "name": "punch13.ogg"
  }, {
    "type": "file",
    "name": "punch14.ogg"
  }, {
    "type": "file",
    "name": "punch15.ogg"
  }, {
    "type": "file",
    "name": "punch16.ogg"
  }, {
    "type": "file",
    "name": "punch17.ogg"
  }, {
    "type": "file",
    "name": "punch18.ogg"
  }, {
    "type": "file",
    "name": "punch19.ogg"
  }, {
    "type": "file",
    "name": "punch2.ogg"
  }, {
    "type": "file",
    "name": "punch20.ogg"
  }, {
    "type": "file",
    "name": "punch3.ogg"
  }, {
    "type": "file",
    "name": "punch4.ogg"
  }, {
    "type": "file",
    "name": "punch5.ogg"
  }, {
    "type": "file",
    "name": "punch6.ogg"
  }, {
    "type": "file",
    "name": "punch7.ogg"
  }, {
    "type": "file",
    "name": "punch8.ogg"
  }, {
    "type": "file",
    "name": "punch9.ogg"
  }, {
    "type": "file",
    "name": "purr.ogg"
  }, {
    "type": "file",
    "name": "rofl_female.ogg"
  }, {
    "type": "file",
    "name": "rofl_male.ogg"
  }, {
    "type": "file",
    "name": "scream_female.ogg"
  }, {
    "type": "file",
    "name": "scream_male.ogg"
  }, {
    "type": "file",
    "name": "shove.ogg"
  }, {
    "type": "file",
    "name": "shut_101.ogg"
  }, {
    "type": "file",
    "name": "shutbuddy_101.ogg"
  }, {
    "type": "file",
    "name": "sigh_female.ogg"
  }, {
    "type": "file",
    "name": "sigh_male.ogg"
  }, {
    "type": "file",
    "name": "sit.ogg"
  }, {
    "type": "file",
    "name": "slap room.ogg"
  }, {
    "type": "file",
    "name": "slap.ogg"
  }, {
    "type": "file",
    "name": "slap2.ogg"
  }, {
    "type": "file",
    "name": "slap3.ogg"
  }, {
    "type": "file",
    "name": "slap4.ogg"
  }, {
    "type": "file",
    "name": "slap5.ogg"
  }, {
    "type": "file",
    "name": "snarl_101.ogg"
  }, {
    "type": "file",
    "name": "snicker_female_101.ogg"
  }, {
    "type": "file",
    "name": "snicker_male.ogg"
  }, {
    "type": "file",
    "name": "sniff_female.ogg"
  }, {
    "type": "file",
    "name": "sniff_male.ogg"
  }, {
    "type": "file",
    "name": "snore.ogg"
  }, {
    "type": "file",
    "name": "snort.ogg"
  }, {
    "type": "file",
    "name": "squeak.ogg"
  }, {
    "type": "file",
    "name": "stand.ogg"
  }, {
    "type": "file",
    "name": "tackle.ogg"
  }, {
    "type": "file",
    "name": "thank_female_101.ogg"
  }, {
    "type": "file",
    "name": "vomit.ogg"
  }, {
    "type": "file",
    "name": "yawn_female_101.ogg"
  }, {
    "type": "file",
    "name": "yawn_female.ogg"
  }, {
    "type": "file",
    "name": "yawn_male.ogg"
  }]
}, {
  "name": "clocks",
  "type": "folder",
  "children": [{
    "name": "bigben",
    "type": "folder",
    "children": [{
      "type": "file",
      "name": "00.ogg"
    }, {
      "type": "file",
      "name": "15.ogg"
    }, {
      "type": "file",
      "name": "30.ogg"
    }, {
      "type": "file",
      "name": "45.ogg"
    }, {
      "type": "file",
      "name": "chime.ogg"
    }]
  }, {
    "name": "grandfather",
    "type": "folder",
    "children": [{
      "type": "file",
      "name": "chime.ogg"
    }]
  }]
}];
},{}],"sounds/soundops.js":[function(require,module,exports) {
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
},{"./sounds":"sounds/sounds.json"}],"sounds/soundplayer.js":[function(require,module,exports) {
const {
  Howl,
  Howler
} = require('howler');

const rng = require('random-int');

const soundops = require('./soundops');

const Sounds = require('./sounds');

const path = require('path');

class SoundPlayer {
  constructor(extension = '.m4a') {
    this.sounds = new Array();
    this.extension = extension;
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
    name = foundChannels.length == 0 ? 'global' : name;
    this.play(name, 'channels');
  }

  playSocial(name, gender) {
    const socials = soundops.findSoundsInFolder('socials');
    let foundSocials = soundops.findFilenames(name + '_' + gender, socials);

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
  constructor(folder, file, extension = '.m4a') {
    if (process.platform) {
      this.basePath = path.join(__dirname, 'sounds/');
    } else {
      this.basePath = './sounds/';
    }

    this.file = file;
    this.folder = folder;
    this.extension = extension;
    this.path = this.basePath + (this.folder ? this.folder + '/' : '') + this.file + this.extension;
    console.log('Loading ' + this.path);
    this.sound = new Howl({
      src: this.path
    });
  }

}

module.exports = SoundPlayer;
},{"./soundops":"sounds/soundops.js","./sounds":"sounds/sounds.json"}],"interface/programmer.js":[function(require,module,exports) {
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
    this.boundMethod = null;
  }

  setEnableHelper(value) {
    this.enabled = value;
  }

  setCode(code) {
    this.code = code;
    console.log('Code: ' + this.code);
  }

  open() {
    this.window = window.open('editor.html');
    setTimeout(() => {
      this.window.postMessage(this.code);
    }, 1000);
    this.boundMethod = this.handleMessage.bind(this);
    window.addEventListener('message', this.boundMethod);
  }

  handleMessage(data) {
    const code = data.data;
    this.sendCode(code);
    window.removeEventListener('message', this.boundMethod);
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
},{}],"tts/mactts.js":[function(require,module,exports) {
'use strict';

const say = require('say');

class TTS {
  constructor() {
    this.enabled = true;
    this.speaking = false;
    this.speakQueue = new Array();
    this.voice = 'alex';
    this.rate = 3.0;
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
    if (!this.enabled) {
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
},{}],"tts/ariatts.js":[function(require,module,exports) {
'use strict';

class TTS {
  constructor() {
    this.enabled = true;
    this.speaking = false;
    this.speakQueue = new Array();
    this.voice = 'alex';
    this.rate = 3.0;
  }

  stopSpeech() {
    let item = document.getElementById("tts");
    item.innerHTML = "";
  }

  speakImmediate(string) {
    let item = document.getElementById("tts");
    item.innerHTML = "";
    this.speak(string);
  }

  speak(string) {
    if (!this.enabled) {
      return;
    }

    string = string.replace('[', ' ');
    string = string.replace(']', ' ');
    console.log('saying ' + string);
    let item = document.getElementById("tts");
    let node = document.createTextNode(string + "\n");
    item.appendChild(document.createElement('br'));
    item.appendChild(node);
  }

}

module.exports = TTS;
},{}],"factories/ttsfactory.js":[function(require,module,exports) {
'use strict';

class TTSFactory {
  static getInstance() {
    switch (process.platform) {
      case 'darwin':
        const MacTTS = require('../tts/mactts');

        return new MacTTS();
        break;

      default:
        const AriaTTS = require('../tts/ariatts');

        return new AriaTTS();
        break;
    }
  }

}

module.exports = TTSFactory;
},{"../tts/mactts":"tts/mactts.js","../tts/ariatts":"tts/ariatts.js"}],"../node_modules/parcel-bundler/src/builtins/bundle-url.js":[function(require,module,exports) {
var bundleURL = null;
function getBundleURLCached() {
  if (!bundleURL) {
    bundleURL = getBundleURL();
  }

  return bundleURL;
}

function getBundleURL() {
  // Attempt to find the URL of the current script and use that as the base URL
  try {
    throw new Error;
  } catch (err) {
    var matches = ('' + err.stack).match(/(https?|file|ftp|chrome-extension|moz-extension):\/\/[^)\n]+/g);
    if (matches) {
      return getBaseURL(matches[0]);
    }
  }

  return '/';
}

function getBaseURL(url) {
  return ('' + url).replace(/^((?:https?|file|ftp|chrome-extension|moz-extension):\/\/.+)\/[^/]+$/, '$1') + '/';
}

exports.getBundleURL = getBundleURLCached;
exports.getBaseURL = getBaseURL;

},{}],"../node_modules/parcel-bundler/src/builtins/css-loader.js":[function(require,module,exports) {
var bundle = require('./bundle-url');

function updateLink(link) {
  var newLink = link.cloneNode();
  newLink.onload = function () {
    link.remove();
  };
  newLink.href = link.href.split('?')[0] + '?' + Date.now();
  link.parentNode.insertBefore(newLink, link.nextSibling);
}

var cssTimeout = null;
function reloadCSS() {
  if (cssTimeout) {
    return;
  }

  cssTimeout = setTimeout(function () {
    var links = document.querySelectorAll('link[rel="stylesheet"]');
    for (var i = 0; i < links.length; i++) {
      if (bundle.getBaseURL(links[i].href) === bundle.getBundleURL()) {
        updateLink(links[i]);
      }
    }

    cssTimeout = null;
  }, 50);
}

module.exports = reloadCSS;

},{"./bundle-url":"../node_modules/parcel-bundler/src/builtins/bundle-url.js"}],"ui/ui.css":[function(require,module,exports) {
var reloadCSS = require('_css_loader');

module.hot.dispose(reloadCSS);
module.hot.accept(reloadCSS);
},{"_css_loader":"../node_modules/parcel-bundler/src/builtins/css-loader.js"}],"ui/mudinput.js":[function(require,module,exports) {
"use strict";

require("./ui.css");

const React = require('react');

class MudInput extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      inputValue: ''
    };
    this.handleChange = this.handleChange.bind(this);
    this.handleKey = this.handleKey.bind(this);
    this.inputRef = React.createRef();
  }

  render() {
    return React.createElement("div", {
      className: "input"
    }, React.createElement("h2", null, "Input"), React.createElement("input", {
      ref: this.inputRef,
      type: "text",
      "aria-label": "Mud Input",
      value: this.state.inputValue,
      onChange: this.handleChange,
      onKeyPress: this.handleKey
    }));
  }

  componentDidMount() {
    this.inputRef.current.focus();
  }

  handleKey(evt) {
    if (evt.key == 'Enter') {
      let value = this.state.inputValue;

      if (value == '') {
        value = this.props.instance.inputHistory.getLastEntered();
      } else if (value != this.props.instance.inputHistory.getLastEntered()) {
        this.props.instance.inputHistory.add(value);
      }

      this.props.instance.connection.send(value);
      this.props.instance.tts.stopSpeech();
      this.setState({
        inputValue: ''
      });
    }
  }

  handleChange(evt) {
    this.setState({
      inputValue: evt.target.value
    });
  }

}

module.exports = MudInput;
},{"./ui.css":"ui/ui.css"}],"settings.json":[function(require,module,exports) {
module.exports = {
  maxLines: 500
};
},{}],"ui/resolvinglink.js":[function(require,module,exports) {
const React = require('react');

const urlToTitle = require('url-to-title');

class ResolvingLink extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      text: this.props.url
    };
    urlToTitle(this.props.url, (err, resolved) => {
      if (err) {
        return;
      }

      this.setState({
        text: resolved
      });
    });
  }

  render() {
    return React.createElement("a", {
      href: this.props.url,
      onClick: this.props.onClick
    }, this.state.text);
  }

}

module.exports = ResolvingLink;
},{}],"ui/outputitem.js":[function(require,module,exports) {
const React = require('react');

const open = require('opn');

const YouTube = require('react-youtube-player').default;

const ResolvingLink = require('./resolvinglink');

class OutputItem extends React.Component {
  constructor(props) {
    super(props); // This.re=/(http|ftp|https):\/\/([\w_-]+(?:(?:\.[\w_-]+)+))([\w.,@?\^=%:\/~+#-]*[\w@?\^=%\/~+#-])?/gi;

    this.re = /((?:http|ftp|https):\/\/(?:[\w_-]+(?:(?:\.[\w_-]+)+))(?:[\w.,@?\^=%:\/~+#-]*[\w@?\^=%\/~+#-])?)/gi;
  }

  itemize(text) {
    const split = text.split(this.re);

    if (split.length == 1) {
      return React.createElement("div", null, split[0]);
    }

    return split.map((item, index) => {
      const re = this.re; // Parcel doesn't let me use this.re directly for some odd reason

      return re.test(item) ? this.parseLink(item) : item;
    });
  }

  openLink(event, link) {
    event.preventDefault();
    open(link);
  }

  parseLink(item) {
    if (item.indexOf('youtube.com/watch') != -1) {
      return this.parseYoutubeLink(item);
    }

    return React.createElement(ResolvingLink, {
      url: item,
      onClick: e => this.openLink(e, item)
    });
  }

  parseYoutubeLink(item) {
    let id = item.split('v=')[1];
    const andPosition = id.indexOf('&');

    if (andPosition != -1) {
      id = id.substring(0, andPosition);
    }

    return React.createElement(YouTube, {
      videoId: id
    });
  }

  render() {
    return React.createElement("div", null, this.itemize(this.props.text));
  }

}

module.exports = OutputItem;
},{"./resolvinglink":"ui/resolvinglink.js"}],"ui/mudoutput.js":[function(require,module,exports) {
const React = require('react');

const Settings = require('../settings.json');

const OutputItem = require('./outputitem');

class MudOutput extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      lines: []
    };
    this.addLine = this.addLine.bind(this);
    this.props.instance.output.on('MudOutput', data => this.addLine(data));
  }

  render() {
    return React.createElement("div", {
      className: "output"
    }, this.state.lines.map((line, index) => {
      return React.createElement(OutputItem, {
        text: line
      });
    }));
  }

  addLine(line) {
    console.log('Adding line: ' + line);

    if (line) {
      const lines = this.state.lines;
      lines.push(line);
      this.setState({
        lines
      });
    }
  }

}

module.exports = MudOutput;
},{"../settings.json":"settings.json","./outputitem":"ui/outputitem.js"}],"ui/settingspanel.js":[function(require,module,exports) {
"use strict";

var _reactAccessibleAccordion = require("react-accessible-accordion");

const {
  Howler
} = require('howler');

const React = require('react');

class SettingsPanel extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      volume: Howler.volume() * 100,
      speech: this.props.instance.tts.enabled,
      resolveLinks: true,
      embedYoutube: true,
      sounds: true
    };
    this.handleVolumeChange = this.handleVolumeChange.bind(this);
    this.handleSpeechStateChange = this.handleSpeechStateChange.bind(this);
  }

  render() {
    return React.createElement(_reactAccessibleAccordion.Accordion, null, React.createElement(_reactAccessibleAccordion.AccordionItem, null, React.createElement(_reactAccessibleAccordion.AccordionItemTitle, null, React.createElement("h2", null, "Audio")), React.createElement(_reactAccessibleAccordion.AccordionItemBody, null, React.createElement("div", null, React.createElement("label", {
      htmlFor: "volume-slider"
    }, "Sound volume"), React.createElement("input", {
      type: "range",
      id: "volume-slider",
      value: this.state.volume,
      onChange: this.handleVolumeChange
    })))), React.createElement(_reactAccessibleAccordion.AccordionItem, null, React.createElement(_reactAccessibleAccordion.AccordionItemTitle, null, React.createElement("h2", null, "Speech")), React.createElement(_reactAccessibleAccordion.AccordionItemBody, null, React.createElement("label", {
      htmlFor: "speech-checkbox"
    }, "Speech enabled"), React.createElement("input", {
      type: "checkbox",
      id: "speech-checkbox",
      onChange: this.handleSpeechStateChange,
      checked: Boolean(this.state.speech)
    }))));
  }

  handleVolumeChange(event) {
    const targetVolume = event.target.value;
    console.log('Target volume at ' + targetVolume / 100);
    Howler.volume(targetVolume / 100);
    this.setState({
      volume: targetVolume
    });
  }

  handleSpeechStateChange(event) {
    console.log('Target value is at ' + event.target.checked);
    this.props.instance.interface.setSpeechEnabled(event.target.checked);
    this.setState({
      speech: event.target.checked
    });
  }

}

module.exports = SettingsPanel;
},{}],"ui/onlinelist.js":[function(require,module,exports) {
'use strict';

require("./ui.css");

var _reactAccessibleAccordion = require("react-accessible-accordion");

const React = require('react');

class OnlineList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      people: {
        active: [],
        idlers: [],
        bots: []
      }
    };
    this.people = {
      active: [],
      bots: [],
      idlers: []
    };
    this.createGroup = this.createGroup.bind(this);
    this.response = null;
  }

  componentWillMount() {
    this.getOnlineList();
  }

  getOnlineList() {
    fetch('http://chatmud.com/api/who').then(response => response.json()).then(data => this.parseData(data));
  }

  parseData(data) {
    for (const item in data.list) {
      console.log('Parsing item: ' + JSON.stringify(data.list[item]));

      if (data.list[item].flags && data.list[item].flags.includes('bot')) {
        const person = {
          name: item,
          title: data.list[item].title
        };
        this.people.bots.push(person);
      } else if (data.list[item].flags.includes('idle')) {
        const person = {
          name: item,
          title: data.list[item].title
        };
        this.people.idlers.push(person);
      } else {
        const person = {
          name: item,
          title: data.list[item].title
        };
        this.people.active.push(person);
      }
    }

    this.setState({
      people: this.people
    });
  }

  createGroup(title, people) {
    return React.createElement("div", null, React.createElement(_reactAccessibleAccordion.AccordionItem, null, React.createElement(_reactAccessibleAccordion.AccordionItemTitle, null, title), React.createElement(_reactAccessibleAccordion.AccordionItemBody, null, React.createElement("ul", null, people.map((item, index) => {
      console.log('Mapping ' + item.name);
      return React.createElement("li", null, item.name, " - ", item.title);
    })))));
  }

  render() {
    return React.createElement("div", {
      "class": "settings-panel"
    }, React.createElement("h1", null, "Who's online"), React.createElement(_reactAccessibleAccordion.Accordion, null, this.createGroup('Active', this.state.people.active), this.createGroup('Bots', this.state.people.bots), this.createGroup('Idlers', this.state.people.idlers)));
  }

}

module.exports = OnlineList;
},{"./ui.css":"ui/ui.css"}],"ui/toolbar.js":[function(require,module,exports) {
"use strict";

require("./ui.css");

const React = require('react');

const SettingsPanel = require('./settingspanel');

const OnlineList = require('./onlinelist');

class ToolBar extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isSettingsOpened: false,
      isOnlineListOpened: false
    };
    this.showSettings = this.showSettings.bind(this);
    this.hideSettings = this.hideSettings.bind(this);
    this.showOnlineList = this.showOnlineList.bind(this);
    this.hideOnlineList = this.hideOnlineList.bind(this);
  }

  render() {
    return React.createElement("div", null, this.renderButtons(), this.renderSettings(), this.renderOnlineList());
  }

  showSettings() {
    this.setState({
      isSettingsOpened: true,
      isOnlineListOpened: false
    });
  }

  hideSettings() {
    this.setState({
      isSettingsOpened: false,
      isOnlineListOpened: false
    });
  }

  renderButtons() {
    const buttons = [];

    if (this.state.isSettingsOpened == true) {
      buttons.push(React.createElement("button", {
        key: "1",
        onClick: this.hideSettings,
        "aria-expanded": "true"
      }, "Settings"));
    } else {
      buttons.push(React.createElement("button", {
        key: "2",
        onClick: this.showSettings,
        "aria-expanded": "false"
      }, "Settings"));
    }

    if (this.state.isOnlineListOpened) {
      buttons.push(React.createElement("button", {
        key: "3",
        onClick: this.hideOnlineList,
        "aria-expanded": "true"
      }, "Online List"));
    } else {
      buttons.push(React.createElement("button", {
        key: "5",
        onClick: this.showOnlineList,
        "aria-expanded": "false"
      }, "Online List"));
    }

    return React.createElement("div", {
      className: "toolbar"
    }, buttons);
  }

  showOnlineList() {
    this.setState({
      isOnlineListOpened: true,
      isSettingsOpened: false
    });
  }

  hideOnlineList() {
    this.setState({
      isOnlineListOpened: false,
      isSettingsOpened: false
    });
  }

  renderSettings() {
    if (this.state.isSettingsOpened) {
      return React.createElement("div", null, React.createElement("div", {
        className: "settings-panel"
      }, React.createElement(SettingsPanel, {
        instance: this.props.instance
      })));
    }
  }

  renderOnlineList() {
    if (this.state.isOnlineListOpened) {
      return React.createElement("div", null, React.createElement("div", null, React.createElement(OnlineList, null)));
    }
  }

}

module.exports = ToolBar;
},{"./ui.css":"ui/ui.css","./settingspanel":"ui/settingspanel.js","./onlinelist":"ui/onlinelist.js"}],"ui/main.js":[function(require,module,exports) {
"use strict";

require("./ui.css");

const React = require('react');

const MudInput = require('./mudinput');

const MudOutput = require('./mudoutput');

const ToolBar = require('./toolbar');

class MainWindow extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return React.createElement("div", null, React.createElement("div", {
      className: "toolbar"
    }, React.createElement(ToolBar, {
      instance: this.props.instance
    })), React.createElement("div", {
      className: "output"
    }, React.createElement(MudOutput, {
      instance: this.props.instance
    })), React.createElement("div", {
      className: "input"
    }, React.createElement(MudInput, {
      instance: this.props.instance
    })));
  }

}

module.exports = MainWindow;
},{"./ui.css":"ui/ui.css","./mudinput":"ui/mudinput.js","./mudoutput":"ui/mudoutput.js","./toolbar":"ui/toolbar.js"}],"interface/interface.js":[function(require,module,exports) {
'use strict';

const Combokeys = require('combokeys');

const React = require('react');

const reactDom = require('react-dom');

const MainUI = require('../ui/main');

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
    reactDom.render(React.createElement(MainUI, {
      instance: this.instance
    }), document.getElementById('app'));
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

  setupEvents() {}

  setSpeechEnabled(state) {
    this.instance.tts.enabled = state;
    this.instance.output.add('Speech ' + (state ? 'enabled' : 'disabled'));
  }

}

module.exports = Interface;
},{"../ui/main":"ui/main.js"}],"history/inputhistory.js":[function(require,module,exports) {
'use strict';

class InputHistory {
  constructor() {
    this.strings = [];
    this.iterator = 0;
  }

  add(string) {
    this.strings.unshift(string);
  }

  getLastEntered() {
    return this.strings[0];
  }

  getAtIndex(index) {
    return this.strings[index];
  }

  getAtIterator() {
    return this.strings[iterator];
  }

  increaseIterator() {
    this.iterator++;

    if (this.iterator > this.strings.length) {
      this.iterator = this.strings.length;
    }

    return this.iterator;
  }

  decreaseIterator() {
    this.iterator--;

    if (this.iterator < 0) {
      this.iterator = 0;
    }

    return this.iterator;
  }

}

module.exports = InputHistory;
},{}],"chatmud.js":[function(require,module,exports) {
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

class ChatMud {
  constructor(connection) {
    console.log('Constructing handler');
    this.output = new CMOutput(this);
    this.connection = connection;
    this.inserts = new Array();
    this.appends = new Array();
    this.history = new ChannelHistory();
    this.historyInterface = new ChannelInterface(this.history, this);
    this.inputHistory = new InputHistory();
    this.soundPlayer = new SoundPlayer();
    this.tts = TTSFactory.getInstance();
    this.interface = new Interface(this);
    this.programmer = new Programmer(this);
    this.info = {
      name: '',
      key: ''
    };
    this.setupEvents();
    this.setupInserts();
    this.setupAppends();
  }

  setupEvents() {
    console.log('Setting events');
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
    console.log('Received data: ' + data);

    for (const insert of this.inserts) {
      data = insert.act(data, this);
    }

    this.output.add(data);

    for (const append of this.appends) {
      console.log('Appending');
      append.act(data, this);
    }
  }

  sendInput() {
    console.log('Handle enter key');
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
},{"./interface/cmoutput":"interface/cmoutput.js","./inserts/inserts.json":"inserts/inserts.json","./factories/insertfactory":"factories/insertfactory.js","./appends/appends.json":"appends/appends.json","./factories/appendfactory":"factories/appendfactory.js","./history/channelhistory":"history/channelhistory.js","./interface/channelinterface":"interface/channelinterface.js","./sounds/soundplayer":"sounds/soundplayer.js","./interface/programmer":"interface/programmer.js","./factories/ttsfactory":"factories/ttsfactory.js","./interface/interface":"interface/interface.js","./history/inputhistory":"history/inputhistory.js"}],"connection/tls.js":[function(require,module,exports) {
'use strict';

const net = require('net');

const EventEmitter = require('eventemitter3');

const TLS = require("tls");

class TCPConnection extends EventEmitter {
  constructor(address = 'chatmud.com', port = 7443) {
    console.log('Connecting to ' + address + ' on port ' + port);
    super();
    this.address = address;
    this.port = port;
    this.client = new net.Socket();
    this.tcp = this.client.connect(this.port, this.address);
    this.options = {
      socket: this.tcp
    };
    this.connection = TLS.connect(this.options, () => this.setupEvents());
    this.data = null;
  }

  setupEvents() {
    console.log('Setting up tcp events');
    this.connection.on('data', data => this.handleData(data));
  }

  handleData(data) {
    console.log('TCP stream: ' + data);
    const string = data.toString();
    this.data += string;

    if (this.data.endsWith('\n')) {
      this.emitData(this.data);
      this.data = '';
    }
  }

  emitData(data) {
    const arr = data.split('\r\n');

    for (const i of arr) {
      this.emit('data', i);
    }
  }

  send(string) {
    console.log('Sending ' + string);
    this.connection.write(string + '\n');
  }

}

module.exports = TCPConnection;
},{}],"connection/websockets.js":[function(require,module,exports) {
'use strict';

const IO = require("socket.io-client");

const EventEmitter = require("eventemitter3");

class Websockets extends EventEmitter {
  constructor() {
    super();
    console.log('constructing websockets');
    this.io = new IO();
    this.setupEvents();
  }

  setupEvents() {
    this.io.on("data", data => this.handleData(data));
  }

  handleData(data) {
    this.emit("data", data);
  }

  send(string) {
    this.io.emit("data", string + "\n");
  }

}

module.exports = Websockets;
},{}],"factories/networkfactory.js":[function(require,module,exports) {
'use strict';

class NetworkFactory {
  static getInstance() {
    if (process.platform) {
      const TLS = require('../connection/tls');

      return TLS;
    } else {
      const Websockets = require('../connection/websockets');

      return Websockets;
    }
  }

}

module.exports = NetworkFactory;
},{"../connection/tls":"connection/tls.js","../connection/websockets":"connection/websockets.js"}],"main.js":[function(require,module,exports) {
'use strict';

const ChatMud = require('./chatmud');

const NetworkFactory = require('./factories/networkfactory');

const SoundPlayer = require('./sounds/soundplayer');

console.log('Starting connection...');
const connection = NetworkFactory.getInstance();
console.log('Creating handler...');
const game = new ChatMud(new connection());
},{"./chatmud":"chatmud.js","./factories/networkfactory":"factories/networkfactory.js","./sounds/soundplayer":"sounds/soundplayer.js"}],"../node_modules/parcel-bundler/src/builtins/hmr-runtime.js":[function(require,module,exports) {
var OVERLAY_ID = '__parcel__error__overlay__';

var OldModule = module.bundle.Module;

function Module(moduleName) {
  OldModule.call(this, moduleName);
  this.hot = {
    data: module.bundle.hotData,
    _acceptCallbacks: [],
    _disposeCallbacks: [],
    accept: function (fn) {
      this._acceptCallbacks.push(fn || function () {});
    },
    dispose: function (fn) {
      this._disposeCallbacks.push(fn);
    }
  };

  module.bundle.hotData = null;
}

module.bundle.Module = Module;
var checkedAssets, assetsToAccept;

var parent = module.bundle.parent;
if ((!parent || !parent.isParcelRequire) && typeof WebSocket !== 'undefined') {
  var hostname = process.env.HMR_HOSTNAME || location.hostname;
  var protocol = location.protocol === 'https:' ? 'wss' : 'ws';
  var ws = new WebSocket(protocol + '://' + hostname + ':' + process.env.HMR_PORT + '/');
  ws.onmessage = function(event) {
    checkedAssets = {};
    assetsToAccept = [];

    var data = JSON.parse(event.data);

    if (data.type === 'update') {
      var handled = false;
      data.assets.forEach(function(asset) {
        if (!asset.isNew) {
          var didAccept = hmrAcceptCheck(global.parcelRequire, asset.id);
          if (didAccept) {
            handled = true;
          }
        }
      });

      // Enable HMR for CSS by default.
      handled = handled || data.assets.every(function(asset) {
        return asset.type === 'css' && asset.generated.js;
      });

      if (handled) {
        console.clear();

        data.assets.forEach(function (asset) {
          hmrApply(global.parcelRequire, asset);
        });

        assetsToAccept.forEach(function (v) {
          hmrAcceptRun(v[0], v[1]);
        });
      } else {
        window.location.reload();
      }
    }

    if (data.type === 'reload') {
      ws.close();
      ws.onclose = function () {
        location.reload();
      }
    }

    if (data.type === 'error-resolved') {
      console.log('[parcel] ✨ Error resolved');

      removeErrorOverlay();
    }

    if (data.type === 'error') {
      console.error('[parcel] 🚨  ' + data.error.message + '\n' + data.error.stack);

      removeErrorOverlay();

      var overlay = createErrorOverlay(data);
      document.body.appendChild(overlay);
    }
  };
}

function removeErrorOverlay() {
  var overlay = document.getElementById(OVERLAY_ID);
  if (overlay) {
    overlay.remove();
  }
}

function createErrorOverlay(data) {
  var overlay = document.createElement('div');
  overlay.id = OVERLAY_ID;

  // html encode message and stack trace
  var message = document.createElement('div');
  var stackTrace = document.createElement('pre');
  message.innerText = data.error.message;
  stackTrace.innerText = data.error.stack;

  overlay.innerHTML = (
    '<div style="background: black; font-size: 16px; color: white; position: fixed; height: 100%; width: 100%; top: 0px; left: 0px; padding: 30px; opacity: 0.85; font-family: Menlo, Consolas, monospace; z-index: 9999;">' +
      '<span style="background: red; padding: 2px 4px; border-radius: 2px;">ERROR</span>' +
      '<span style="top: 2px; margin-left: 5px; position: relative;">🚨</span>' +
      '<div style="font-size: 18px; font-weight: bold; margin-top: 20px;">' + message.innerHTML + '</div>' +
      '<pre>' + stackTrace.innerHTML + '</pre>' +
    '</div>'
  );

  return overlay;

}

function getParents(bundle, id) {
  var modules = bundle.modules;
  if (!modules) {
    return [];
  }

  var parents = [];
  var k, d, dep;

  for (k in modules) {
    for (d in modules[k][1]) {
      dep = modules[k][1][d];
      if (dep === id || (Array.isArray(dep) && dep[dep.length - 1] === id)) {
        parents.push(k);
      }
    }
  }

  if (bundle.parent) {
    parents = parents.concat(getParents(bundle.parent, id));
  }

  return parents;
}

function hmrApply(bundle, asset) {
  var modules = bundle.modules;
  if (!modules) {
    return;
  }

  if (modules[asset.id] || !bundle.parent) {
    var fn = new Function('require', 'module', 'exports', asset.generated.js);
    asset.isNew = !modules[asset.id];
    modules[asset.id] = [fn, asset.deps];
  } else if (bundle.parent) {
    hmrApply(bundle.parent, asset);
  }
}

function hmrAcceptCheck(bundle, id) {
  var modules = bundle.modules;
  if (!modules) {
    return;
  }

  if (!modules[id] && bundle.parent) {
    return hmrAcceptCheck(bundle.parent, id);
  }

  if (checkedAssets[id]) {
    return;
  }
  checkedAssets[id] = true;

  var cached = bundle.cache[id];

  assetsToAccept.push([bundle, id]);

  if (cached && cached.hot && cached.hot._acceptCallbacks.length) {
    return true;
  }

  return getParents(global.parcelRequire, id).some(function (id) {
    return hmrAcceptCheck(global.parcelRequire, id)
  });
}

function hmrAcceptRun(bundle, id) {
  var cached = bundle.cache[id];
  bundle.hotData = {};
  if (cached) {
    cached.hot.data = bundle.hotData;
  }

  if (cached && cached.hot && cached.hot._disposeCallbacks.length) {
    cached.hot._disposeCallbacks.forEach(function (cb) {
      cb(bundle.hotData);
    });
  }

  delete bundle.cache[id];
  bundle(id);

  cached = bundle.cache[id];
  if (cached && cached.hot && cached.hot._acceptCallbacks.length) {
    cached.hot._acceptCallbacks.forEach(function (cb) {
      cb();
    });
    return true;
  }
}

},{}]},{},["../node_modules/parcel-bundler/src/builtins/hmr-runtime.js","main.js"], null)
//# sourceMappingURL=main.1f19ae8e.js.map