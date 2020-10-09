import { ConfigManager } from './config';

export class AutoLogin {
  configManager: ConfigManager;
  constructor(configManager) {
    this.configManager = configManager;
  }

  get() {
    const setting = this.configManager.get('autologin');
    if (!setting) return;
    const parsed = JSON.parse(setting);
    const { username, password } = parsed;
    return {
      username,
      password,
    };
  }

  set(data) {
    this.configManager.set('autologin', JSON.stringify(data));
  }
}
