const dt = require("./dirtree");
const fs = require('fs');

function createAssetList() {
	const dir = '../sounds/';
	dt(dir, (err, tree) => {
		fs.writeFile('../js/sounds/sounds.json', JSON.stringify(tree), (err) => {
			if (err) throw err;
			console.log("Wrote asset list successfully.");
		})
	});
}

module.exports.createAssetList = createAssetList;