export class InputHistory {
  strings: string[];
  iterator: number;
  constructor() {
    this.strings = [];
    this.iterator = 0;
  }

  add(string: string): void {
    this.strings.unshift(string);
  }

  getLastEntered(): string {
    return this.strings[0];
  }

  getAtIndex(index: number): string {
    return this.strings[index];
  }

  getAtIterator(): string {
    return this.strings[this.iterator];
  }

  increaseIterator(): number {
    this.iterator++;
    if (this.iterator > this.strings.length) {
      this.iterator = this.strings.length;
    }
    return this.iterator;
  }

  decreaseIterator(): number {
    this.iterator--;
    if (this.iterator < 0) {
      this.iterator = 0;
    }
    return this.iterator;
  }
}
