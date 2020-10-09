import fsu from 'fs';
import path from 'path';
import Module from './module';
const fs = fsu.promises;

class Media extends Module {
  constructor(instance) {
    super(instance);
    this.id = 'Client.Media';
  }

  async Play(data) {
    const { name, url } = data;
    const parsed_path = path.parse(name);
    const folder = parsed_path.dir;
    const file = parsed_path.base;
    console.log(fs);
    try {
      await fs.access(__dirname + '/sounds/' + name, fsu.constants.F_OK);
      console.log('succeeded!');
    } catch {
      console.log('failed!');
      const response = await fetch(url + name, { 'mode': 'no-cors' });
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

export default Media;
