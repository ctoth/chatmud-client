const sox = require('sox.js');

sox({
    inputFile: '../sounds/cancel.ogg',
    outputFile: './test.wav'
});
console.log("meow);")