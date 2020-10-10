import { Insert } from './insert';

export class Triggers extends Insert {
  act(string, instance) {
    this.instance = instance;
    this.executeTriggers(string);
    return string;
  }

  executeTriggers(string) {
    let matched = string.match('^Turning (off|on) channel ([a-zA-Z0-9]*)?.');
    if (matched) {
      this.instance.soundPlayer.play(matched[1]);
    }

    matched = string.match("^I don't understand that.$");
    if (matched) {
      this.instance.soundPlayer.play('huh', 'misc');
    }

    matched = string.match('^(>> Command Aborted <<|Invalid selection.)$');
    if (matched) {
      this.instance.soundPlayer.play('cancel');
    }

    matched = string.match(
      "(\\[(Type a line of input or `@abort' to abort the command|Type lines of input; use `\\.' to end or `@abort' to abort the command)\\.\\]|\\[Enter `yes' or `no'\\])",
    );
    if (matched) {
      this.instance.soundPlayer.play('prompt');
    }

    matched = string.match('You click your heels three times.');
    if (matched) {
      this.instance.soundPlayer.play('home', 'misc');
    }

    matched = string.match(
      '[Connections] A new high player count has been reached! * players are connected.',
    );
    if (matched) {
      this.instance.soundPlayer.play('high%connections', 'misc');
    }

    matched = string.match(
      '[Creation] * has just connected for the first time! Please make them feel welcome.',
    );
    if (matched) {
      this.instance.soundPlayer.play('creation');
    }

    matched = string.match('(.*) says,(.*)');
    if (matched) {
      this.instance.soundPlayer.play('say');
    }

    matched = string.match('^You say,*?');
    if (matched) {
      this.instance.soundPlayer.play('say');
    }
  }
}
