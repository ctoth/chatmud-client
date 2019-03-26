const parcel = require('parcel-bundler');
const rimraf = require('rimraf');
const path = require('path');
const fs = require('fs-extra');
const proxy = null;


const mode = process.argv[2];

removeOld(mode);


function build(mode) {
	const entryPoint = path.join(__dirname, '../src/index.html');
	const options = {
		outDir: path.join(__dirname, '../app_' + mode +'/'),
		watch: true,
		hmr: true,
		minify: false,
        sourcemaps: true,
        publicUrl: './'
    }
    if (mode === 'desktop') {
        options.target = 'electron';
    } else {
		options.target = 'browser';
		server = require('../web-proxy');
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