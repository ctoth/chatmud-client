import sounds from './sounds.json';

function search(string, object) {
  for (const entry of object) {
    if (entry.name === string) {
      return entry.children;
    }
  }
}

export function findSoundsInFolder(path) {
  const split = path.split('/');
  let directory = sounds;
  for (const string of split) {
    directory = search(string, directory);
  }
  return directory;
}

export function findFilenames(string, array): string[] {
  const returnObject = [];
  for (const entry of array) {
    if (entry.name.includes(string)) {
      returnObject.push(entry.name);
    }
  }
  return returnObject;
}
