import { Insert } from './insert';

export class PingUtils implements Insert {
  token: any;
  time: number;
  constructor(token) {
    this.token = token;
    this.time = 0;
  }

  start() {
    this.time = performance.now();
  }

  stop() {
    this.time = performance.now() - this.time;
  }
}
