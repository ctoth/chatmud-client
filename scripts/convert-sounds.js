const sox = require('sox.js');
const dt = require('./dirtree');

const dir = '../sounds';
const outputPath = './sounds/';


    dt(dir, (err, tree) => {
        const currentPath = dir;
        processNode(tree);
    })
    


function convertSound(path, name, format) {
console.log("Converting: " + dir + path + name + ".ogg")
console.log("To: " + outputPath + path + name + '.' + format)
    sox({
        inputFile: dir + path + name + ".ogg",
        outputFile: outputPath + path + name + "." + format
    });

}

function processNode(node, prevPath = '/') {
    console.log("Processing some node: " + node);
    node.forEach(element => {
        if (element.type === 'folder') {
            processNode(element.children, prevPath + element.name + "/");
        } else {

        
            console.log("Converting: " + prevPath + element.name + '.m4a');
            convertSound(prevPath, element.name, 'wav');
        }   
    });
}