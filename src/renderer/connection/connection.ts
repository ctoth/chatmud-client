import { Node } from '../node';

export abstract class Connection extends Node {
  abstract send(data: string): void;
}
