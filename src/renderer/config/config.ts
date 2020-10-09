export class ConfigManager {
  localStorage: Storage;
  constructor() {
    this.localStorage = window.localStorage || undefined;
  }

  get(key) {
    return this.localStorage.getItem(key) || undefined;
  }

  set(key, value) {
    this.localStorage.setItem(key, value);
  }
}
