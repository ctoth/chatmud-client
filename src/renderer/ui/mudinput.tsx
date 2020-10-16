import './ui.css';

import React from 'react';
import { Client } from '../client';

interface Props {
  instance: Client;
}

interface State {
  inputValue: string;
}

export class MudInput extends React.Component {
  inputRef: React.RefObject<HTMLInputElement>;
  state: State = {
    inputValue: '',
  };
  props: Props;

  constructor(props: Props) {
    super(props);
    this.handleChange = this.handleChange.bind(this);
    this.handleKey = this.handleKey.bind(this);
    this.inputRef = React.createRef();
  }

  render() {
    return (
      <div className="input">
        <h2>Input</h2>
        <input
          ref={this.inputRef}
          type="text"
          aria-label="Mud Input"
          value={this.state.inputValue}
          onChange={this.handleChange}
          onKeyPress={this.handleKey}
        />
      </div>
    );
  }

  componentDidMount() {
    this.inputRef.current.focus();
  }

  handleKey(event_) {
    if (event_.key === 'Enter') {
      let value = this.state.inputValue;
      if (value === '') {
        value = this.props.instance.inputHistory.getLastEntered();
      } else if (value !== this.props.instance.inputHistory.getLastEntered()) {
        this.props.instance.inputHistory.add(value);
      }

      this.props.instance.connection.send(value + '\n');
      this.props.instance.tts.stopSpeech();
      this.setState({
        inputValue: '',
      });
    }
  }

  handleChange(event_) {
    this.setState({
      inputValue: event_.target.value,
    });
  }
}
