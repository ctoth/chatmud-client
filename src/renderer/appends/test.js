'use strict';

class Test {
  constructor() {
    this.instance = null;
    this.meow = null;
    this.hmm = null;
  }

  act(string, instance) {
    this.instance = instance;
    this.instance.soundPlayer.play('event');
  }
}

export default Test;
