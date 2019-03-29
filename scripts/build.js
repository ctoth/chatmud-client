const parcel = require('parcel-bundler');
const rimraf = require('rimraf');
const path = require('path');
const fs = require('fs-extra');

const mode = process.argv[2];

removeOld(mode);


async function build(mode) {
	const entryPoint = path.join(__dirname, '../src/index.html');
	const options = {
		outDir: path.join(__dirname, '../app_' + mode +'/'),
		watch: false,
		hmr: false,
		minify: true,
		sourcemaps: false,
		target: (mode === 'desktop' ? 'electron' : 'browser'),
		publicUrl: './',
    }
	const bundler = new parcel(entryPoint, options);
	bundler.bundle();
	console.log('bundling...');
}

async function copyAssets(mode) {
	console.log('copying assets to ' + path.join(__dirname, 'app_'+mode));
	fs.ensureDirSync(path.join(__dirname, '../app_'+mode));
	fs.ensureDirSync(path.join(__dirname, '../app_'+mode+'/sounds'));
	fs.copySync(path.join(__dirname, '../sounds'), path.join(__dirname, '../app_'+mode+"/sounds"));
	fs.copySync(path.join(__dirname, '../editor'), path.join(__dirname, '../app_'+mode));
	if (mode === 'desktop') {
		fs.copySync(path.join(__dirname, '../electron'), path.join(__dirname, '../app_'+mode));
	}
	console.log('copied assets');
}

function removeOld(mode) {
    rimraf(path.join(__dirname, '../app_' + mode), err => {
		if (err) throw err;
		copyAssets(mode);
		build(mode);
    });
}