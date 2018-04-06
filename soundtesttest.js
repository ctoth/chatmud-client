const soundops = require("./soundtest");

let socials = soundops.findSoundsInFolder("socials");
let kicks = soundops.findFilenames("Kick", socials);
console.log("Found: " + JSON.stringify(kicks));