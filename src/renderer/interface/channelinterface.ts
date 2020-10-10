import { Client } from '../client';
import { ChannelHistory } from '../history/channelhistory';

export class ChannelInterface {
  instance: Client;
  currentChannel: number;
  currentMessage: number;
  history: ChannelHistory;
  constructor(history: ChannelHistory, instance: Client) {
    this.instance = instance;
    this.history = history;
  }

  nextChannel(): void {
    if (this.currentChannel < this.history.channels.length - 1) {
      this.currentChannel++;
    } else {
      this.currentChannel = this.history.channels.length - 1;
    }

    this.instance.tts.speakImmediate(
      this.history.channels[this.currentChannel].name,
    );
  }

  previousChannel(): void {
    if (this.currentChannel > 0) {
      this.currentChannel--;
    } else {
      this.currentChannel = 0;
    }

    this.instance.tts.speakImmediate(
      this.history.channels[this.currentChannel].name,
    );
  }

  nextMessage(): void {
    if (this.currentMessage > 0) {
      this.currentMessage--;
    } else {
      this.currentMessage = 0;
    }

    this.readMessage(this.currentMessage);
  }

  previousMessage(): void {
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
