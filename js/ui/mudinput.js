const React = require('react');

import './ui.css';

class MudInput extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			inputValue: ''
		};
		this.handleChange = this.handleChange.bind(this);
		this.handleKey = this.handleKey.bind(this);
		this.inputRef=React.createRef();
	}

	render() {
		return (
			<div className="input">
				<h2>Input</h2>
				<input ref={this.inputRef} type="text" aria-label="Mud Input" aria-required="true" value={this.state.inputValue} onChange={this.handleChange} onKeyPress={this.handleKey}/>
			</div>
		);
	}

	componentDidMount() {
		this.inputRef.current.focus();
	}

	handleKey(evt) {
		if (evt.key == 'Enter') {
			this.props.instance.connection.send(this.state.inputValue);
			this.props.instance.tts.stopSpeech();
			this.setState({
				inputValue: ''
			});
		}
	}

	handleChange(evt) {
		this.setState({
			inputValue: evt.target.value
		});
	}
}

module.exports = MudInput;
