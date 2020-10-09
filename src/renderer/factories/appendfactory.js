'use strict';
const appends = {};
class AppendFactory {
  static getInstance(instance) {
    return appends[instance];
  }
}

export default AppendFactory;
