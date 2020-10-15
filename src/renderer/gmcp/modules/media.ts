import fsu from 'fs';
import path from 'path';
import { GmcpModule } from './module';
const fs = fsu.promises;

export class Media extends GmcpModule {
  isModule = true;
  id = 'Client.Media';

  async Play(data) {
    const { name, url } = data;
    const parsedPath = path.parse(name);
    const folder = parsedPath.dir;
    const file = parsedPath.base;
    console.log(fs);
    try {
      await fs.access(__dirname + '/sounds/' + name, fsu.constants.F_OK);
      console.log('succeeded!');
    } catch {
      console.log('failed!');
      const response = await fetch(url + name, { mode: 'no-cors' });
      const buff = await response.arrayBuffer();
      await fs.mkdir(__dirname + '/sounds/' + folder, { recursive: true });
      await fs.writeFile(__dirname + '/sounds/' + name, Buffer.from(buff));
    }
    this.instance.soundPlayer.play(
      encodeURI(file.split('.')[0]),
      encodeURI(folder),
    );
  }
}
