import './ui.css';

import React from 'react';
import { MudInput } from './mudinput';
import { MudOutput } from './mudoutput';
import { ToolBar } from './toolbar';
import { Client } from '../client';

interface Props {
  instance: Client;
}
export class MainWindow extends React.Component<Props> {
  render() {
    return (
      <div>
        <div>
          <ToolBar instance={this.props.instance} />
        </div>
        <div>
          <MudOutput instance={this.props.instance} />
        </div>
        <div className="input">
          <MudInput instance={this.props.instance} />
        </div>
      </div>
    );
  }
}
