import './ui.css';

const React = require('react');
const MudInput = require('./mudinput');
const MudOutput = require('./mudoutput');
const ToolBar = require('./toolbar');

class MainWindow extends React.Component {
	constructor(props) {
		super(props);
	}

	render() {
		return (
			<div>
				<div>
					<ToolBar instance={this.props.instance}/>
				</div>
				<div>
					<MudOutput instance={this.props.instance}/>
				</div>
				<div className="input">
					<MudInput instance={this.props.instance}/>
				</div>
			</div>
		);
	}
}

module.exports = MainWindow;
