'use strict';

class ConfigManager {
    constructor() {
        this.localStorage = window.localStorage || null;
    }

    get(key) {
        return this.localStorage.getItem(key) || null;
    }

    set(key, value) {
        this.localStorage.setItem(key, value);
    }
}

module.exports = ConfigManager;