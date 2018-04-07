const sounds = require("./sounds");

function findSoundsInFolder(path) {
	let split = path.split("/");
	let directory = sounds;
	for (let string of split) {
		directory = search(string, directory);
	}
	return directory;
}

function search(string, object) {
	for (let entry of object) {
		if (entry.name == string) return entry.children;
	}
	
}

function findFilenames(string, array) {
	let returnObj = [];
	for (let entry of array) {
		if (entry.name.includes(string)) returnObj.push(entry.name);
	}
	return returnObj;
}

module.exports.findSoundsInFolder = findSoundsInFolder;
module.exports.findFilenames = findFilenames;