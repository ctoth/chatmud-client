// We have to call the GMCP constant something else because we use the name for the class.
const {GMCP, DO, IAC, IS, SB, SE, SEND, TTYPE, WILL} = require('../constants');

const Node = require('../node');

class Gmcp extends Node {
  constructor(instance) {
    super();
    this.instance = instance;
    this.wanted_events = ["GMCP", "Negociation"];
  }

  handleGMCP(match) {
    console.log("package:"+match[1]+"json:"+match[2]);
    this.emit('gmcp', match[1], JSON.parse(match[2]));
  }

  handleNegociation(data) {
    if (data == IAC+WILL+GMCP) {
      this.instance.connection.send(IAC+DO+GMCP);
      // Why not a send gmcp function? because we don't need one for just sending two messages.
      let listeners = this.children.filter(i=>i.isModule);
      let hello = JSON.stringify({
        Client: "ChatMud Web Client",
        Version: "0.1",
      });
      let supports = JSON.stringify(listeners.map(i=>i.id+" 1"));
      console.log("LISTENERS:"+supports);
      this.instance.connection.send(IAC+SB+GMCP+"Core.Hello"+" "+hello+IAC+SE);
      this.instance.connection.send(IAC+SB+GMCP+"Core.Supports.Set"+" "+supports+IAC+SE);
      this.instance.connection.send(IAC + WILL + TTYPE);
    }
  }
}

module.exports = Gmcp;
