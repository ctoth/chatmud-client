import { Client } from '../../client';
import { GmcpModule } from './module';

export class Channel extends GmcpModule {
  isModule = true;
  id = 'Comm.Channel';

  Text(data): void {
    this.instance.history.addMessage(data.channel, data.text);
  }
}
