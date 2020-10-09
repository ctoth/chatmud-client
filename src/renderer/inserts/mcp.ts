import { Insert } from './insert';
import { PingUtils } from './pingutils';

export class MCP extends Insert {
  key: number;
  name: number;
  pings: any[];
  constructor() {
    super();
    this.instance = null;
    this.key = 0;
    this.name = 0;
    this.pings = [];
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
      } catch {
        this.instance.output.add('Error parsing MCP: ' + string);
      }
    } else {
      this.parse(string);
    }

    return '';
  }

  parse(string) {
    let s1 = string.slice(3, string.length);
    s1 = s1.trim();
    let command = s1.slice(0, s1.indexOf(' '));

    command = command.trim();
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

    if (command === 'mcp') {
      this.initMCP();
    }

    this.executeMCP(command, s2, key);
  }

  initMCP() {
    this.instance.connection.send(
      '#$#register_client Chatmud Official Client (Alpha)',
    );
    this.instance.connection.send('#$#client_supports authkeys');
    this.instance.connection.send('#$#client_supports json');
    this.instance.connection.send('#$#client_supports check_netlag');
  }

  executeMCP(command, arguments_, key) {
    if (key) {
      this.checkKey(key);
    }

    switch (command) {
      case 'authentication_key':
        this.key = arguments_[0];
        this.instance.info.key = arguments_[0];
        break;
      case 'my_name':
        this.name = arguments_[0];
        this.instance.info.name = arguments_[0];
        break;
      case 'channel_message':
        this.handleChannelMessage(arguments_);
        break;
      case 'channel_social':
        this.handleChannelSocial(arguments_);
        break;
      case 'channel_emote':
        this.handleChannelEmote(arguments_);
        break;
      case 'social':
        this.handleSocial(arguments_);
        break;

      case 'watched_player_connect':
        this.handlePlayerConnect(arguments_);
        break;
      case 'watched_player_reconnect':
        this.handlePlayerReconnect(arguments_);
        break;
      case 'watched_player_disconnect':
        this.handlePlayerDisconnect(arguments_);
        break;
      case 'teleport_out':
        this.handlePlayerTeleportOut(arguments_);
        break;
      case 'teleport_in':
        this.handlePlayerTeleportIn(arguments_);
        break;
      case 'tell_message':
        this.handleTell(arguments_);
        break;
      case 'edit':
        this.handleEdit(arguments_);
        break;

      case 'netlag':
        this.handleNetLag(arguments_);
        break;
      default:
        this.handlePlay(command, arguments_);
        break;
    }
  }

  handleChannelMessage(arguments_) {
    this.instance.history.addMessage(
      arguments_.name,
      arguments_.prefix + arguments_.message,
    );
    this.instance.output.add(arguments_.prefix + ' ' + arguments_.message);
    this.instance.soundPlayer.playChannel(arguments_.name);
  }

  handleChannelEmote(arguments_) {
    this.instance.history.addMessage(
      arguments_.name,
      arguments_.sender + arguments_.message,
    );
    this.instance.output.add(
      '[' +
        arguments_.name +
        '] ' +
        arguments_.sender +
        ' ' +
        arguments_.message,
    );
    this.instance.soundPlayer.playChannel(arguments_.name);
  }

  handleChannelSocial(arguments_) {
    this.instance.history.addMessage(
      arguments_.name,
      arguments_.name + ': ' + arguments_.message,
    );
    this.instance.output.add(arguments_.name + ': ' + arguments_.message);
    this.instance.soundPlayer.playSocial(arguments_.social, arguments_.gender);
    this.instance.soundPlayer.playChannel(arguments_.name);
  }

  handleSocial(arguments_) {
    this.instance.soundPlayer.playSocial(
      arguments_.data[0],
      arguments_.data[2],
    );
  }

  handlePlay(command, arguments_) {
    if (arguments_.data) {
      this.instance.soundPlayer.play(arguments_.data[0], command);
    }
  }

  handlePlayerConnect(arguments_) {
    this.instance.soundPlayer.play('enter');
    this.instance.output.add(arguments_.data[0] + ' connected');
  }

  handlePlayerReconnect(arguments_) {
    this.instance.soundPlayer.play('reconnect');
    this.instance.output.add(arguments_[0] + ' reconnected');
  }

  handlePlayerDisconnect(arguments_) {
    this.instance.soundPlayer.play('leave');
    this.instance.output.add(arguments_.data[0] + ' disconnected');
  }

  handlePlayerTeleportOut(arguments_) {
    this.instance.soundPlayer.play('teleport%20out', 'misc');
  }

  handlePlayerTeleportIn(arguments_) {
    this.instance.soundPlayer.play('teleport%20in', 'misc');
  }

  handleTell(arguments_) {
    this.instance.soundPlayer.play('tell');
    this.instance.output.add(
      arguments_.data[0] + ' ' + arguments_.data[1] + ' ' + arguments_.data[2],
    );
  }

  handleEdit(arguments_) {
    const arguments2 = arguments_[0].split(' ');
    // let verb = args2[1].split(":")[1];
    // let object = args2[4].split(":")[0];
    this.instance.programmer.setObject(arguments2[arguments2.length - 1]);
    this.instance.programmer.setEnableHelper(true);
  }

  checkKey(key) {
    if (key !== this.key) {
      this.instance.soundPlayer.play('spoofer', 'misc');
      this.instance.output.add('Spoof attempt!');
    }
  }

  handleNetLag(arguments_) {
    if (arguments_.data[0] === 'ping') {
      const newPing = new PingUtils(arguments_.data[1]);
      this.instance.connection.send('#$#netlag pong ' + arguments_.data[1]);
      newPing.start();
      this.pings.push(newPing);
    }

    if (arguments_.data[0] === 'pang') {
      const myPing = this.findPingByToken(arguments_.data[1]);
      myPing.stop();
    }
  }

  findPingByToken(token) {
    for (const ping of this.pings) {
      if (ping.token === token) {
        return ping;
      }
    }
  }
}

export default MCP;
