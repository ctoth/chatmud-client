'use strict';

const EventEmitter = require('events');

// Todo: we may want to patch the emit function to allow events that get emitted anywhere to be subscribed to from anywhere else (e.g. bubble down unsubscribed events).

class Node extends EventEmitter {
  constructor() {
    super();
    this.children = [];
    this.wanted_events = ["Data"];
  }

  connect(node) {
    // this is hacky. If it doesn't work out we will probably want to go back to just making nodes subscribe to data.
    this.children.unshift(node);
    for (const i of node.wanted_events) {
      this.on(i.toLowerCase(), node["handle"+i].bind(node));
    }
    return node;
  }

  series(...nodes) {
    // Connects all the nodes in a series, where this node is the starting point and the last node is the one that will be returned.
    return nodes.reduce((prev, next)=>prev.connect(next), this);
  }

  parallel(...nodes) {
    for (const node of nodes) {
      this.connect(node);
    }
    return this;
  }

  handleData(data) {
    this.emit('data', data);
  }
}

module.exports = Node;
