import { ChatMud } from './chatmud';
import { NetworkFactory } from './factories/networkfactory';

const Connection = NetworkFactory.getInstance();
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const game = new ChatMud(new Connection());
