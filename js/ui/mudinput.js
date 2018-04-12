const React = require("react");

class MudInput extends React.Component {
	constructor(props) {
		super(props);
		this.state ={
			inputValue: ""
		}
		this.handleChange = this.handleChange.bind(this);
		this.handleKey = this.handleKey.bind(this);
	}
	
	render() {
		return (
		<div>
		<h2>Input</h2>
		<input type="text" value={this.state.inputValue} onChange={this.handleChange} onKeyPress={this.handleKey}/>
		</div>
		);
	}
	
	handleKey(evt) {
		if (evt.key == "Enter") {
			this.props.instance.connection.send(this.state.inputValue);
			this.setState({
				inputValue:""
			});
		}
		
	}
	
	handleChange(evt) {
		this.setState({
			inputValue:evt.target.value
		});
	}
	
}

module.exports = MudInput;