import { Client } from './client';
import { NetworkFactory } from './factories/networkfactory';

const Connection = NetworkFactory.getInstance();
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const game = new Client(new Connection());
