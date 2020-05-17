"use strict";
const EventEmitter = require("eventemitter3");

// Telnet codes //
const IS = String.fromCharCode(0); // \x00
const SEND = String.fromCharCode(1); // \x01
const ECHO = String.fromCharCode(1); // \x01
const ETX = String.fromCharCode(3); // \x03
const EOT = String.fromCharCode(4); // \x04
const TTYPE = String.fromCharCode(24); // \x18
const EOR1 = String.fromCharCode(25); // \x19
const MSDP = String.fromCharCode(69); // \x45
const MSSP = String.fromCharCode(70); // \x46
const MCCP2 = String.fromCharCode(86); // \x56
const MCCP = String.fromCharCode(90); // \x5A
const MXP = String.fromCharCode(91); // \x5B
const ZMP = String.fromCharCode(93); // \x5D

const EOR = String.fromCharCode(239); // \xEF
const SE = String.fromCharCode(240); // \xF0
const GA = String.fromCharCode(249); // \xF9
const SB = String.fromCharCode(250); // \xFA

const WILL = String.fromCharCode(251); // \xFB
const WONT = String.fromCharCode(252); // \xFC
const DO = String.fromCharCode(253); // \xFD
const DONT = String.fromCharCode(254); // \xFE
const IAC = String.fromCharCode(255); // \xFF

const ATCP = String.fromCharCode(200); // \xC8
const GMCP = String.fromCharCode(201); // \xC9

const ESC = String.fromCharCode(27); // \x1B

// GMCP //

const GMCP_RE = /\xFF\xFA\xC9([^\xFF]+)\xFF\xF0/;
const SUPPORTS = [
  "Char 1",
  "Char.Items 1",
  "Comm.Channel 1",
  "Room 1",
  "Client.Media 1",
];

class Connection extends EventEmitter {
  constructor() {
    super();
  }

  processIncoming(data) {
    return this.handleTelnetNegotiation(data);
  }

  handleTelnetNegotiation(data) {
    const re = /\xFF[\xFB|\xFC|\xFD|\xFE][\x00-\xFF]/gm;
    let matches;
    while ((matches = re.exec(data))) {
        console.log("Matches: ", matches);
      const negotiationType = matches[0][1];
      const feature = matches[0][2];

      if (negotiationType == WILL || negotiationType == DO) {
        if (feature == GMCP) {
          // Also send what we WILL do //
          this.send_GMCP("Core.Hello", {
            Client: "ChatMud Web Client",
            Version: "0.1",
          });
          this.send_GMCP("Core.Supports.Set", SUPPORTS);

          // also send termtype here
          // IAC WILL TTYPE; IAC SB TTYPE IS XTERM-256COLOR IAC SE
          this.send(IAC + WILL + TTYPE);
          this.send(IAC + SB + TTYPE + IS + "XTERM-256COLOR" + IAC + SE);
        } else {
          if (negotiationType == WILL) this.send(IAC + DONT + nfeature);
          else this.send(IAC + WONT + nfeature);
        }
      }
    }

    return data.replace(/\xFF[\xFB|\xFC|\xFD|\xFE][\x00-\xFF]/gm, "");
  }

  sendGMCP(message_type, message) {
    var smessage = JSON.stringify(message);
    this.send("\xFF\xFA\xC9" + message_type + " " + smessage + "\xFF\xF0");
  }

  handleData(data) {
    this.emit("data", data);
  }
}

module.exports = Connection;
