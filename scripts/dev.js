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
		outDir: path.join(__dirname, '../app_' + mode +'/'),
		watch: true,
		hmr: false,
		minify: false,
		sourcemaps: true,
		target: 'browser'
	}
	const bundler = new parcel(entryPoint, options);
	bundler.bundle();
	console.log('bundling...');
}

function copyAssets(mode) {
	console.log('copying assets to app_'+mode);
	fs.ensureDirSync(path.join(__dirname, './app_'+mode);
	fs.ensureDirSync(path.join(__dirname, '../app_'+mode+'/sounds'));
	fs.copySync(path.join(__dirname, '../sounds'), path.join(__dirname, './app_'+mode+"/sounds"));
	fs.copySync(path.join(__dirname, '../editor'), path.join(__dirname, '../app_'+mode));
	if (mode === 'desktop') {
		fs.copySync(path.join(__dirname, '../electron'), path.join(__dirname, './app_'+mode));
	}
	console.log('copied assets');
}