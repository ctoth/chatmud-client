import Channel from './modules/channel';
import Media from './modules/media';

function initializeModules(instance) {
  return [new Channel(instance), new Media(instance)];
}

export default initializeModules;