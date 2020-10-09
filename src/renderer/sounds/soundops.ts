import sounds from './sounds';

function findSoundsInFolder(path) {
  const split = path.split('/');
  let directory = sounds;
  for (const string of split) {
    directory = search(string, directory);
  }
  return directory;
}

function search(string, object) {
  for (const entry of object) {
    if (entry.name == string) {
      return entry.children;
    }
  }
}

function findFilenames(string, array) {
  const returnObject = [];
  for (const entry of array) {
    if (entry.name.includes(string)) {
      returnObject.push(entry.name);
    }
  }
  return returnObject;
}

export { findSoundsInFolder };
export { findFilenames };
export default {
  findSoundsInFolder,
  findFilenames,
};
