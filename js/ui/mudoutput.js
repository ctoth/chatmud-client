const React = require('react');
const Settings = require('../settings.json');
const OutputItem = require('./outputitem');

class MudOutput extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			lines: []
		};
		this.addLine = this.addLine.bind(this);
		this.props.instance.output.on('MudOutput', data => this.addLine(data));
	}

	render() {
		return (
			<div className="output">

				{this.state.lines.map((line, index) => {
					return <OutputItem text={line} />;
				})}

			</div>
		);
	}

	addLine(line) {
		console.log('Adding line: ' + line);
		if (line) {
			const lines = this.state.lines;
			lines.push(line);
			this.setState({
				lines
			});
		}
	}
}

module.exports = MudOutput;
