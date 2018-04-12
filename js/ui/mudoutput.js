const React = require("react");

class MudOutput extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			lines: []
		}
		this.addLine = this.addLine.bind(this);
		this.props.instance.output.on("MudOutput", data => this.addLine(data));
	}
	
	render() {
		return (
		<div>
		<h2>Output</h2>

		{this.state.lines.map((line, index) => {
			return <div>{line}</div>;
		})}
		
		</div>
		);
	}
	
	addLine(line) {
		console.log("Adding line: " + line);
		if (line) {
		
			let lines = this.state.lines;
			lines.push(line);
			this.setState({
				lines:lines
			});
		}
	}
	
}

module.exports = MudOutput;