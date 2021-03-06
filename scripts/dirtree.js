var fs = require('fs');
var path = require('path');

var dirTreeToObj = function(dir, done) {
	var results = [];

	fs.readdir(dir, function(err, list) {
		if (err)
			return done(err);

		var pending = list.length;

		if (!pending)
			return done(null, {name: path.basename(dir), type: 'folder', children: results});

		list.forEach(function(file) {
			file = path.resolve(dir, file);
			fs.stat(file, function(err, stat) {
				if (stat && stat.isDirectory()) {
					dirTreeToObj(file, function(err, res) {
						results.push({
							name: path.basename(file),
							type: 'folder',
							children: res
						});
						if (!--pending)
							done(null, results);
					});
				}
				else {
					results.push({
						type: 'file',
						name: path.parse(file).name
					});
					if (!--pending)
						done(null, results);
				}
			});
		});
	});
};

module.exports = dirTreeToObj;