export class Programmer {
  constructor(instance) {
    this.instance = instance;
    this.code = '';
    this.object = '';
    this.enabled = false;
    this.window = null;
    this.lines = [];
    this.currentLine = 0;
    this.boundMethod = null;
  }

  setEnableHelper(value) {
    this.enabled = value;
  }

  setCode(code) {
    this.code = code;
  }

  open() {
    this.window = window.open('editor.html');
    setTimeout(() => {
      this.window.postMessage(this.code);
    }, 1000);
    this.boundMethod = this.handleMessage.bind(this);
    window.addEventListener('message', this.boundMethod);
  }

  handleMessage(data) {
    const code = data.data;
    this.sendCode(code);
    window.removeEventListener('message', this.boundMethod);
  }

  sendCode(data) {
    const lines = data.split('\n');
    this.lines = lines;
    this.instance.connection.send('@program ' + this.object);
    for (const line of lines) {
      this.instance.connection.send(line);
    }
    this.instance.connection.send('.');
    this.code = '';
    this.enabled = false;
  }

  setObject(object) {
    this.object = object;
  }
}

export default Programmer;
