import "./ui.css";
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
		<div className="output">
		<MudOutput instance={this.props.instance}/>
		</div>
		<div className="input">
		<MudInput 

		instance={this.props.instance}
		/>
		</div>
		</div>
		);
	}
	
}

module.exports = MainWindow;