const dt = require("./dirtree");

const dir = "../sounds/";

dt(dir, (err, tree) => {
	console.log(JSON.stringify(tree));
});