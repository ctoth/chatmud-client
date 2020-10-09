import { WebTTS } from '../inserts/webtts';
import { MCP } from '../inserts/mcp';
import { Triggers } from '../inserts/triggers';
import { ProgrammerHelper } from '../inserts/programmerhelper';
import { Notifier } from '../inserts/notifier';

const inserts = {
  webtts: WebTTS,
  mcp: MCP,
  triggers: Triggers,
  programmerhelper: ProgrammerHelper,
  notifier: Notifier,
};

export class InsertFactory {
  static getInsert(name) {
    return inserts[name];
  }
}
