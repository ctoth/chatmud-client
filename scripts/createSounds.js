const dt = require("./dirtree");

const dir = "./app/sounds/";

dt(dir, (err, tree) => {
	console.log(JSON.stringify(tree));
});