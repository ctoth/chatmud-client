import Constants from '../../constants';
import { Node } from '../../node';
const { GMCP, IAC, SB, SE } = Constants;

export class Module extends Node {
  id: string;
  isModule: boolean;
  constructor(instance) {
    super();
    this.instance = instance;
    this.id = '';
    this.wanted_events = ['GMCP'];
    this.isModule = true;
  }

  handleGMCP(name, data) {
    const words = name.split('.');
    const id = words.slice(0, -1).join('.');
    if (id === this.id) {
      const verb = words[words.length - 1];
      if (this[verb]) this[verb](data);
    }
  }

  send(verb, data) {
    // By default packages are limited to sending commands for just themselves; will change if required
    this.instance.connection.send(
      IAC + SB + GMCP + this.id + verb + ' ' + JSON.stringify(data) + IAC + SE,
    );
  }
}
