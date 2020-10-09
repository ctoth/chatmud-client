import Constants from '../constants';
import { Node } from '../node';
const { DO, DONT, GMCP, IAC, IS, SB, SE, TTYPE, WILL, WONT } = Constants;

// Todo: refactor! very haphazardly thrown together

export class Telnet extends Node {
  connection: any;
  data: string;
  constructor(instance) {
    super();
    this.connection = instance.connection;
  }

  handleData(data) {
    // Negociators
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

    data = data.replace(/\u00FF[|\u00FB-\u00FE][\u0000-\u00FF]/gm, '');

    // Handling TTYPE (IAC SB SEND TTYPE IAC SE)
    const ttype_re = /\u00FF\u00FA\u0018\u0001\u00FF\u00F0/;
    if (ttype_re.test(data)) {
      this.connection.send(IAC + SB + TTYPE + IS + 'dumb' + IAC + SE);
      data = data.replace(ttype_re, '');
    }

    // "handling" color (for regexp see https://stackoverflow.com/questions/25245716/remove-all-ansi-colors-styles-from-strings)
    data = data.replace(
      /[\u001B\u009B][#();?[]*(?:\d{1,4}(?:;\d{0,4})*)?[\d<=>A-ORZcf-nqry]/g,
      '',
    );

    // Handling GMCP subnegociation
    const gmcp_re = /\u00FF\u00FA\u00C9(\S+)\s([^\u00F0\u00FF]+)\u00FF\u00F0/g;
    let gmcp_matches;
    while ((gmcp_matches = gmcp_re.exec(data)) !== null) {
      this.emit('gmcp', gmcp_matches);
    }

    data = data.replace(gmcp_re, '');

    this.data += data;
    if (this.data.endsWith('\n')) {
      while (this.data.includes('\n')) {
        this.emit('data', this.data.slice(0, this.data.indexOf('\n') + 1));
        this.data = this.data.slice(this.data.indexOf('\n') + 1);
      }
    }
  }
}
