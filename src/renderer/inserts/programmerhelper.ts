import { Client } from '../client';
import { Insert } from './insert';

export class ProgrammerHelper extends Insert {
  code = '';
  receiving = false;

  act(string: string, instance: Client): string {
    if (instance.programmer.enabled === true) {
      if (this.receiving === false) {
        this.receiving = true;
        this.code = '';
      }

      this.instance = instance;
      console.log('Checking: ' + string);
      if (string === '.') {
        this.instance.programmer.setCode(this.code);
        this.instance.programmer.open();
        this.instance.programmer.setEnableHelper(false);
        this.receiving = false;
      }
      this.code += string + '\n';
      return '';
    }
    return string;
  }
}
