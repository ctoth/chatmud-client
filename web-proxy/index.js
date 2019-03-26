const Websockets = require("./websockets");
const express = require("express");
const path = require('path');

const app = express();
app.use(express.static(path.join(__dirname, '../app_web')));
const server = app.listen(3647);
const ws = new Websockets(server);

console.log("Listening on port 3647");