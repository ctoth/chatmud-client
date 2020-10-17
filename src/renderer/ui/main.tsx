import './ui.css';

import React from 'react';
import { MudInput } from './mudinput';
import { MudOutput } from './mudoutput';
import { ToolBar } from './toolbar';
import { Client } from '../client';

interface Properties {
  instance: Client;
}
export class MainWindow extends React.Component<Properties> {
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
