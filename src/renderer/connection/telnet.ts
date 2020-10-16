import { Client } from '../client';
import Constants from '../constants';
import { Node } from '../node';
import { Connection } from './connection';
const { DO, DONT, GMCP, IAC, IS, SB, SE, TTYPE, WILL, WONT } = Constants;

// Todo: refactor! very haphazardly thrown together

export class Telnet extends Node {
  connection: Connection;
  data = '';
  constructor(instance: Client) {
    super();
    this.connection = instance.connection;
  }

  handleData(data: string): void {
    // Negociators
    // eslint-disable-next-line no-control-regex
    const re = /\u00FF[|\u00FB-\u00FE][\u0000-\u00FF]/gm;
    let matches;
    while ((matches = re.exec(data)) !== null) {
      if (matches[0][1] === WILL && matches[0][2] === GMCP) {
        this.emit('negociation', matches[0]);
      } else if (matches[0][1] === DO && matches[0][2] === TTYPE) {
        this.connection.send(IAC + WILL + TTYPE);
      } else {
        if (matches[0][1] === WILL)
          this.connection.send(IAC + DONT + matches[0][2]);
        else this.connection.send(IAC + WONT + matches[0][2]);
      }
    }

    // eslint-disable-next-line no-control-regex
    data = data.replace(/\u00FF[|\u00FB-\u00FE][\u0000-\u00FF]/gm, '');

    // Handling TTYPE (IAC SB SEND TTYPE IAC SE)
    // eslint-disable-next-line no-control-regex
    const ttypeRe = /\u00FF\u00FA\u0018\u0001\u00FF\u00F0/;
    if (ttypeRe.test(data)) {
      this.connection.send(IAC + SB + TTYPE + IS + 'dumb' + IAC + SE);
      data = data.replace(ttypeRe, '');
    }

    // "handling" color (for regexp see https://stackoverflow.com/questions/25245716/remove-all-ansi-colors-styles-from-strings)
    data = data.replace(
      // eslint-disable-next-line no-control-regex
      /[\u001B\u009B][#();?[]*(?:\d{1,4}(?:;\d{0,4})*)?[\d<=>A-ORZcf-nqry]/g,
      '',
    );

    // Handling GMCP subnegociation
    const gmcpRe = /\u00FF\u00FA\u00C9(\S+)\s([^\u00F0\u00FF]+)\u00FF\u00F0/g;
    let gmcpMatches;
    while ((gmcpMatches = gmcpRe.exec(data)) !== null) {
      this.emit('gmcp', gmcpMatches);
    }

    data = data.replace(gmcpRe, '');

    this.data += data;
    if (this.data.endsWith('\n')) {
      while (this.data.includes('\n')) {
        this.emit('data', this.data.slice(0, this.data.indexOf('\n') + 1));
        this.data = this.data.slice(this.data.indexOf('\n') + 1);
      }
    }
  }
}
