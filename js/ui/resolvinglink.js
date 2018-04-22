const React = require('react');
const urlToTitle = require('url-to-title');

class ResolvingLink extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			text: this.props.url
		};
		urlToTitle(this.props.url, (err, resolved) => {
			if (err) {
				return;
			}
			this.setState({text: resolved});
		});
	}

	render() {
		return <a href={this.props.url} onClick={this.props.onClick}>{this.state.text}</a>;
	}
}

module.exports = ResolvingLink;
