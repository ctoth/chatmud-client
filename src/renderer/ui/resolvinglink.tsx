import React from 'react';
import urlToTitle from 'url-to-title';

interface Props {
  url: string;
  onClick: (event) => void;
}
interface State {
  text: string;
}
export class ResolvingLink extends React.Component<Props, State> {
  constructor(props) {
    super(props);
    this.state = {
      text: this.props.url,
    };
    urlToTitle(this.props.url, (error, resolved) => {
      if (error) {
        return;
      }
      this.setState({ text: resolved });
    });
  }

  render() {
    return (
      <a
        href={this.props.url}
        key={this.props.url}
        onClick={this.props.onClick}
      >
        {this.state.text}
      </a>
    );
  }
}
