export class PingUtils {
  token: any;
  time: number;
  constructor(token) {
    this.token = token;
  }

  start() {
    this.time = performance.now();
  }

  stop() {
    this.time = performance.now() - this.time;
  }
}
