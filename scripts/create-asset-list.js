const dt = require("./dirtree");
const fs = require('fs');
const path = require('path');

createAssetList();
function createAssetList() {
	const dir = '../sounds/';
	dt(dir, (err, tree) => {
		fs.writeFile(path.join(__dirname, '../src/sounds/sounds.json'), JSON.stringify(tree), (err) => {
			if (err) throw err;
			console.log("Wrote asset list successfully.");
		})
	});
}

module.exports.createAssetList = createAssetList;