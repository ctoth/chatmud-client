'use strict';
import ChannelHistory from '../history/channelhistory';

class ChannelInterface {
  constructor(history, instance) {
    this.instance = instance;
    this.currentChannel = 0;
    this.currentMessage = 0;
    this.history = history;
  }

  nextChannel() {
    if (this.currentChannel < this.history.channels.length - 1) {
      this.currentChannel++;
    } else {
      this.currentChannel = this.history.channels.length - 1;
    }

    this.instance.tts.speakImmediate(
      this.history.channels[this.currentChannel].name,
    );
  }

  previousChannel() {
    if (this.currentChannel > 0) {
      this.currentChannel--;
    } else {
      this.currentChannel = 0;
    }

    this.instance.tts.speakImmediate(
      this.history.channels[this.currentChannel].name,
    );
  }

  nextMessage() {
    if (this.currentMessage > 0) {
      this.currentMessage--;
    } else {
      this.currentMessage = 0;
    }

    this.readMessage(this.currentMessage);
  }

  previousMessage() {
    if (
      this.currentMessage <
      this.history.channels[this.currentChannel].messages.length - 1
    ) {
      this.currentMessage++;
    } else {
      this.currentMessage =
        this.history.channels[this.currentChannel].messages.length - 1;
    }

    this.readMessage(this.currentMessage);
  }

  readMessage(id) {
    this.instance.tts.speakImmediate(
      this.history.channels[this.currentChannel].messages[id],
    );
  }
}

export default ChannelInterface;
