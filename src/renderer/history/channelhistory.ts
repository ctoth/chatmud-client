import { Channel } from './channel';

export class ChannelHistory {
  channels: Channel[] = [];

  addMessage(pChannel: string, message): void {
    let channel = this.getChannelByName(pChannel);
    if (!channel) {
      channel = new Channel(pChannel);
      this.channels.push(channel);
    }
    channel.addMessage(message);
  }

  getChannelByName(name: string): Channel | undefined {
    for (const channel of this.channels) {
      if (channel.name === name) {
        return channel;
      }
    }
  }

  getMessageForChannel(name: string, id: number) {
    const channel = this.getChannelByName(name);
    return channel.messages[id];
  }
}
