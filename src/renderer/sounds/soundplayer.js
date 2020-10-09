import { Howl, Howler } from 'howler';
import rng from 'random-int';
import soundops from './soundops';
import Sounds from './sounds';
import path from 'path';

class SoundPlayer {
  constructor(extension = '.m4a') {
    this.sounds = [];
    this.extension = extension;
  }

  play(file, folder = '') {
    let mFile = this.searchSounds(file, folder);
    if (mFile == -1) {
      mFile = this.loadSound(file, folder);
    }
    mFile.sound.play();
  }

  playChannel(name) {
    const channels = soundops.findSoundsInFolder('channels');
    const foundChannels = soundops.findFilenames(name, channels);
    name = foundChannels.length == 0 ? 'global' : name;
    this.play(name, 'channels');
  }

  playSocial(name, gender) {
    const socials = soundops.findSoundsInFolder('socials');
    let foundSocials = soundops.findFilenames(name + '_' + gender, socials);
    if (foundSocials.length == 0) {
      foundSocials = soundops.findFilenames(name, socials);
    }
    let filename = null;
    if (foundSocials.length > 0) {
      filename = foundSocials[rng(0, foundSocials.length - 1)].toString();
      // filename = filename.slice(0, filename.length - 4);
    }

    if (!filename) {
      return;
    }

    this.play(filename, 'socials');
  }

  searchSounds(file, folder) {
    for (const sound of this.sounds) {
      if (sound.file == file && sound.folder == folder) {
        return sound;
      }
    }
    return -1;
  }

  loadSound(file, folder) {
    const sound = new Sound(folder, file);
    this.sounds.push(sound);
    return sound;
  }
}

class Sound {
  constructor(folder, file, extension = '.m4a') {
    this.basePath = './sounds/';
    this.file = file;
    this.folder = folder;
    this.extension = extension;
    this.path =
      this.basePath +
      (this.folder ? this.folder + '/' : '') +
      this.file +
      this.extension;
    this.sound = new Howl({ src: path.normalize(this.path) });
  }
}

export default SoundPlayer;
