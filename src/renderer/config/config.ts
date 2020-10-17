export class ConfigManager {
  localStorage: Storage;
  constructor() {
    this.localStorage = window.localStorage || undefined;
  }

  get(key: string): any {
    return this.localStorage.getItem(key) || undefined;
  }

  set(key: string, value: any): void {
    this.localStorage.setItem(key, value);
  }
}
