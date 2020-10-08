const {GMCP, IAC, SB, SE} = require('../../constants');

const Node = require('../../node');

class Module extends Node {
  constructor(instance) {
    super();
    this.instance = instance;
    this.id = '';
    this.wanted_events = ["GMCP"];
    this.isModule=true;
  }

  handleGMCP(name, data) {
    let words = name.split('.');
    let id = words.slice(0, -1).join('.');
    if (id===this.id) {
      let verb = words[words.length-1];
      if (this[verb]) this[verb](data);
    }
  }

  send(verb, data) {
    // By default packages are limited to sending commands for just themselves; will change if required
    this.instance.connection.send(IAC+SB+GMCP+this.id+verb+" "+JSON.stringify(data)+IAC+SE);
  }
}

module.exports=Module;
