import { Client } from '../client';
import Constants from '../constants';
import { Node } from '../node';
import { GmcpModule } from './modules/module';
const { GMCP, DO, IAC, SB, SE, TTYPE, WILL } = Constants;

export class Gmcp extends Node {
  instance: Client;
  children: GmcpModule[];
  wantedEvents = ['GMCP', 'Negociation'];

  constructor(instance: Client) {
    super();
    this.instance = instance;
  }

  handleGMCP(match: string[]): void {
    console.log('package:' + match[1] + 'json:' + match[2]);
    this.emit('gmcp', match[1], JSON.parse(match[2]));
  }

  handleNegociation(data: string): void {
    if (data === IAC + WILL + GMCP) {
      this.instance.connection.send(IAC + DO + GMCP);
      // Why not a send gmcp function? because we don't need one for just sending two messages.
      const listeners = this.children.filter(i => i.isModule);
      const hello = JSON.stringify({
        Client: 'ChatMud Web Client',
        Version: '0.1',
      });
      const supports = JSON.stringify(listeners.map(i => i.id + ' 1'));
      console.log('LISTENERS:' + supports);
      this.instance.connection.send(
        IAC + SB + GMCP + 'Core.Hello' + ' ' + hello + IAC + SE,
      );
      this.instance.connection.send(
        IAC + SB + GMCP + 'Core.Supports.Set' + ' ' + supports + IAC + SE,
      );
      this.instance.connection.send(IAC + WILL + TTYPE);
    }
  }
}
