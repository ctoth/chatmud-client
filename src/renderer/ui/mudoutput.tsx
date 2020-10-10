import React from 'react';
import Settings from '../settings.json';
import { OutputItem } from './outputitem';
import Scroll from 'react-custom-scroll';

export class MudOutput extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      lines: [],
      maxLines: 1000,
    };
    this.addLine = this.addLine.bind(this);
    this.props.instance.output.on('MudOutput', data => this.addLine(data));
    this.screenBottom = null;
  }

  render() {
    return (
      <div className="output">
        <div>
          <div>
            {this.state.lines.map((item, index) => {
              if (index > this.state.lines.length - this.state.maxLines) {
                return (
                  <div className="output-item" key={index}>
                    {item}
                  </div>
                );
              }
            })}
          </div>
          <div
            style={{ float: 'left', clear: 'both' }}
            ref={el => {
              this.screenBottom = el;
            }}
          ></div>
        </div>
      </div>
    );
  }

  scrollToBottom() {
    console.log(`Scrolling to bottom.`);
    this.screenBottom.scrollIntoView({ behavior: 'smooth' });
  }

  addLine(line) {
    this.scrollToBottom();
    if (line) {
      let lines = this.state.lines;
      if (lines.length > this.state.maxLines) {
        const newLines = lines.filter((item, index) => {
          if (index > this.state.maxLines / 1.5) {
            return true;
          }
          return false;
        });
        lines = newLines;
      }
      lines.push(<OutputItem text={line} />);
      this.setState({
        lines,
      });
    }
  }

  componentDidUpdate() {
    this.scrollToBottom();
  }

  componentDidMount() {
    this.scrollToBottom();
  }
}
