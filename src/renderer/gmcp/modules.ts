import { Channel } from './modules/channel';
import { Media } from './modules/media';

export function initializeModules(instance): [Channel, Media] {
  return [new Channel(instance), new Media(instance)];
}

export default initializeModules;
