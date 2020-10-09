import Appends from './appends/appends.json';
import { AutoLogin } from './config/autologin';
import { ConfigManager } from './config/config';
import { Telnet } from './connection/telnet';
import { TLSConnection } from './connection/tls';
import { Websockets } from './connection/websockets';
import { AppendFactory } from './factories/appendfactory';
import { InsertFactory } from './factories/insertfactory';
import { TTSFactory } from './factories/ttsfactory';
import { Gmcp } from './gmcp/gmcp';
import { initializeModules } from './gmcp/modules';
import { ChannelHistory } from './history/channelhistory';
import { InputHistory } from './history/inputhistory';
import { Insert } from './inserts/insert';
import Inserts from './inserts/inserts.json';
import { ChannelInterface } from './interface/channelinterface';
import { CMOutput } from './interface/cmoutput';
import { Interface } from './interface/interface.jsx';
import { Programmer } from './interface/programmer';
import { Node } from './node';
import { SoundPlayer } from './sounds/soundplayer';

export class Client extends Node {
  public output: CMOutput;
  public connection: TLSConnection | Websockets;
  public telnet: Telnet;
  inserts: Insert[] = [];
  appends: any[] = [];
  public history: ChannelHistory;
  inputHistory: InputHistory;
  soundPlayer: SoundPlayer;
  tts: any;
  gmcp: Gmcp;
  configManager: ConfigManager;
  autoLogin: AutoLogin;
  interface: Interface;
  programmer: Programmer;
  info: { name: string; key: string };
  historyInterface: ChannelInterface;
  input: any;

  constructor(connection: TLSConnection | Websockets) {
    super();
    this.output = new CMOutput(this);
    this.connection = connection;
    this.telnet = new Telnet(this);
    this.history = new ChannelHistory();
    this.historyInterface = new ChannelInterface(this.history, this);
    this.inputHistory = new InputHistory();
    this.soundPlayer = new SoundPlayer();
    this.tts = TTSFactory.getInstance();
    this.gmcp = new Gmcp(this);
    this.configManager = new ConfigManager();
    this.autoLogin = new AutoLogin(this.configManager);
    this.interface = new Interface(this);
    this.programmer = new Programmer(this);
    this.info = {
      name: '',
      key: '',
    };

    this.setupEvents();
    this.setupInserts();
    this.setupAppends();
    this.handleAutoLogin();
  }

  handleAutoLogin(): void {
    setTimeout(() => {
      const loginData = this.autoLogin.get();
      if (loginData && loginData.username && loginData.password) {
        alert(`Automatically logging in`);
        this.connection.send(
          `connect ${loginData.username} ${loginData.password}`,
        );
      }
    }, 1000);
  }

  setupEvents(): void {
    this.connection
      .connect(this.telnet)
      .parallel(this.gmcp.parallel(...initializeModules(this)))
      .connect(this);
  }

  setupInserts(): void {
    for (const insertDef of Inserts) {
      const Insert = InsertFactory.getInsert(insertDef);
      const instance = new Insert();
      this.inserts.push(instance);
    }
  }

  setupAppends(): void {
    for (const appendDef of Appends) {
      const Append = AppendFactory.getInstance(appendDef);
      const instance = new Append();
      this.appends.push(instance);
    }
  }

  handleData(data): void {
    for (const insert of this.inserts) {
      data = insert.act(data, this);
    }

    this.output.add(data);

    for (const append of this.appends) {
      append.act(data, this);
    }
  }

  sendInput(): void {
    let string: string = this.input.value;
    if (string === 'my_name') {
      this.output.add('Your name is set to ' + this.info.name);
    }
    this.output.add(
      'Input history: ' + JSON.stringify(this.inputHistory.strings),
    );
    if (string === '') {
      string = this.inputHistory.getLastEntered();
    } else if (string !== this.inputHistory.getLastEntered()) {
      this.inputHistory.add(string);
    }

    this.connection.send(string);

    this.input.value = '';
  }
}
