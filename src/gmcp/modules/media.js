const fsu = require('fs');
const fs = fsu.promises;
const path = require('path');

const Module = require('./module');

class Media extends Module {
  constructor(instance) {
    super(instance);
    this.id = 'Client.Media';
  }

  async Play(data) {
    const {name, url} = data;
    let parsed_path = path.parse(name);
    let folder = parsed_path.dir;
    let file = parsed_path.base;
    console.log(fs);
    try {
      await fs.access(__dirname+"/sounds/"+name, fsu.constants.F_OK);
      console.log("succeeded!");
    } catch(err) {
      console.log("failed!");
      let response = await fetch(url+name);
      let buff = await response.arrayBuffer();
      await fs.mkdir(__dirname+"/sounds/"+folder, {recursive: true});
      await fs.writeFile(__dirname+"/sounds/"+name, new Buffer(buff));
    }
    this.instance.soundPlayer.play(encodeURI(file.split('.')[0]), encodeURI(folder));
  }
}

module.exports = Media;