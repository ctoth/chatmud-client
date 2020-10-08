const {DO, DONT, GMCP, IAC, IS, SB, SE, TTYPE, WILL, WONT} = require('../constants')
const Node = require('../node');

// Todo: refactor! very haphazardly thrown together

class Telnet extends Node {
  constructor(instance) {
    super();
    this.connection = instance.connection;
    this.data = '';
  }

  handleData(data) {
    // Negociators
    const re = /\xFF[\xFB|\xFC|\xFD|\xFE][\x00-\xFF]/mg;
    let matches;
    while ((matches = re.exec(data)) !== null) {
      if (matches[0][1] == WILL && matches[0][2]==GMCP) {
        this.emit('negociation', matches[0]);
      } else if (matches[0][1]==DO&&matches[0][2]==TTYPE) {
        this.connection.send(IAC + WILL + TTYPE);
      } else {
        if (matches[0][1] == WILL) this.connection.send(IAC+DONT+matches[0][2]);
        else this.connection.send(IAC+WONT+matches[0][2]);
      }
    }
    
    data = data.replace(/\xFF[\xFB|\xFC|\xFD|\xFE][\x00-\xFF]/gm, "");
    
    // Handling TTYPE (IAC SB SEND TTYPE IAC SE)
    let ttype_re = /\xFF\xFA\x18\x01\xFF\xF0/;
    if (ttype_re.test(data)) {
        this.connection.send(IAC + SB + TTYPE + IS + "dumb" + IAC + SE);
        data = data.replace(ttype_re, "");
    }
    
    // "handling" color (for regexp see https://stackoverflow.com/questions/25245716/remove-all-ansi-colors-styles-from-strings)
    data = data.replace(/[\u001b\u009b][[()#;?]*(?:[0-9]{1,4}(?:;[0-9]{0,4})*)?[0-9A-ORZcf-nqry=><]/g, "");
    
    // Handling GMCP subnegociation
    let gmcp_re = /\xFF\xFA\xC9(\S+)\s([^\xFF\xF0]+)\xFF\xF0/g;
    let gmcp_matches;
    while ((gmcp_matches=gmcp_re.exec(data)) !== null) {
        this.emit('gmcp', gmcp_matches);
    }
    
    data = data.replace(gmcp_re, "");
    
    this.data += data;
    if (this.data.endsWith("\n")) {
      while (this.data.indexOf("\n") !== -1) {
        this.emit('data', this.data.slice(0, this.data.indexOf("\n")+1));
        this.data = this.data.slice(this.data.indexOf("\n")+1);
      }
    }
  }
}

module.exports = Telnet;