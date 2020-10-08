const Channel = require('./modules/channel');
const Media = require('./modules/media');

function initializeModules(instance) {
  return [new Channel(instance), new Media(instance)];
}

module.exports=initializeModules;