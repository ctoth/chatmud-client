import './ui.css';

import React from 'react';
import { SettingsPanel } from './settingspanel';
import { OnlineList } from './onlinelist';
import { Client } from '../client';

interface Properties {
  instance: Client;
}
interface State {
  isSettingsOpened: boolean;
  isOnlineListOpened: boolean;
}

export class ToolBar extends React.Component<Properties, State> {
  state: State;
  constructor(properties: Readonly<Properties>) {
    super(properties);
    this.state = {
      isSettingsOpened: false,
      isOnlineListOpened: false,
    };
    this.showSettings = this.showSettings.bind(this);
    this.hideSettings = this.hideSettings.bind(this);
    this.showOnlineList = this.showOnlineList.bind(this);
    this.hideOnlineList = this.hideOnlineList.bind(this);
  }

  render() {
    return (
      <div>
        {this.renderButtons()}
        {this.renderSettings()}
        {this.renderOnlineList()}
      </div>
    );
  }

  showSettings(): void {
    this.setState({
      isSettingsOpened: true,
      isOnlineListOpened: false,
    });
  }

  hideSettings(): void {
    this.setState({
      isSettingsOpened: false,
      isOnlineListOpened: false,
    });
  }

  renderButtons() {
    const buttons = [];

    if (this.state.isSettingsOpened === true) {
      buttons.push(
        <button key="1" onClick={this.hideSettings} aria-expanded="true">
          Settings
        </button>,
      );
    } else {
      buttons.push(
        <button key="2" onClick={this.showSettings} aria-expanded="false">
          Settings
        </button>,
      );
    }

    if (this.state.isOnlineListOpened) {
      buttons.push(
        <button key="3" onClick={this.hideOnlineList} aria-expanded="true">
          Online List
        </button>,
      );
    } else {
      buttons.push(
        <button key="5" onClick={this.showOnlineList} aria-expanded="false">
          Online List
        </button>,
      );
    }
    return <div className="toolbar">{buttons}</div>;
  }

  showOnlineList(): void {
    this.setState({
      isOnlineListOpened: true,
      isSettingsOpened: false,
    });
  }

  hideOnlineList(): void {
    this.setState({
      isOnlineListOpened: false,
      isSettingsOpened: false,
    });
  }

  renderSettings() {
    if (this.state.isSettingsOpened) {
      return (
        <div>
          <div className="settings-panel">
            <SettingsPanel instance={this.props.instance} />
          </div>
        </div>
      );
    } else {
      return <div> </div>;
    }
  }

  renderOnlineList() {
    if (this.state.isOnlineListOpened) {
      return (
        <div>
          <div>
            <OnlineList />
          </div>
        </div>
      );
    }
  }
}
