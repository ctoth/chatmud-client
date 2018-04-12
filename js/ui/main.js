const React = require("react");
const MudInput = require("./mudinput");
const MudOutput = require("./mudoutput");
class MainWindow extends React.Component {
	constructor(props) {
		super(props);
	}
	
	
	
	render() {
		return (
		<div>
		<MudOutput instance={this.props.instance}/>
		<MudInput instance={this.props.instance}/>
		</div>
		);
	}
	
}

module.exports = MainWindow;