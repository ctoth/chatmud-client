const appends = {};
export class AppendFactory {
  static getInstance(instance) {
    return appends[instance];
  }
}
