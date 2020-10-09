import { Howl } from 'howler';
import rng from 'random-int';
import soundops from './soundops';
import Sounds from './sounds.json';
import path from 'path';
export class Sound {
  basePath: string;
  file: string;
  folder: string;
  extension: string;
  path: string;
  sound: Howl;
  constructor(folder: string, file: string, extension = '.m4a') {
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

export class SoundPlayer {
  sounds: Sound[] = [];
  extension: string;
  constructor(extension = '.m4a') {
    this.extension = extension;
  }

  play(file, folder = ''): void {
    let mFile = this.searchSounds(file, folder);
    if (mFile === undefined) {
      mFile = this.loadSound(file, folder);
    }
    mFile.sound.play();
  }

  playChannel(name) {
    const channels = soundops.findSoundsInFolder('channels');
    const foundChannels = soundops.findFilenames(name, channels);
    name = foundChannels.length === 0 ? 'global' : name;
    this.play(name, 'channels');
  }

  playSocial(name, gender) {
    const socials = soundops.findSoundsInFolder('socials');
    let foundSocials = soundops.findFilenames(name + '_' + gender, socials);
    if (foundSocials.length === 0) {
      foundSocials = soundops.findFilenames(name, socials);
    }
    let filename;
    if (foundSocials.length > 0) {
      filename = foundSocials[rng(0, foundSocials.length - 1)].toString();
      // filename = filename.slice(0, filename.length - 4);
    }

    if (!filename) {
      return;
    }

    this.play(filename, 'socials');
  }

  searchSounds(file: string, folder: string): Sound {
    for (const sound of this.sounds) {
      if (sound.file === file && sound.folder === folder) {
        return sound;
      }
    }
  }

  loadSound(file: string, folder: string): Sound {
    const sound = new Sound(folder, file);
    this.sounds.push(sound);
    return sound;
  }
}
