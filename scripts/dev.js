const parcel = require('parcel-bundler');
const rimraf = require('rimraf');
const path = require('path');
const fs = require('fs-extra');

const mode = process.argv[2];

copyAssets(mode);
build(mode);

function build(mode) {
	const entryPoint = path.join(__dirname, '../html/index.html');
	const options = {
		outDir: '../app_' + mode,
			watch: true,
			hmr: false
	}
	const bundler = new parcel(entryPoint, options);
	bundler.bundle();
	console.log('bundling...');
}

function copyAssets(mode) {
	console.log('copying assets to app_'+mode);
	fs.ensureDirSync('./app_'+mode);
	fs.ensureDirSync('./app_'+mode+"/sounds");
	fs.copySync('./sounds', './app_'+mode+"/sounds");
	fs.copySync('./editor', './app_'+mode);
	if (mode === 'desktop') {
		fs.copySync('./electron', './app_'+mode);
	}
	console.log('copied assets');
}