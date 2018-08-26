import './ui.css';

const React = require('react');

class MudInput extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			inputValue: ''
		};
		this.handleChange = this.handleChange.bind(this);
		this.handleKey = this.handleKey.bind(this);
		this.inputRef = React.createRef();
	}

	render() {
		return (
			<div className="input">
				<h2>Input</h2>
				<input ref={this.inputRef} type="text" aria-label="Mud Input" value={this.state.inputValue} onChange={this.handleChange} onKeyPress={this.handleKey}/>
			</div>
		);
	}

	componentDidMount() {
		this.inputRef.current.focus();
	}

	handleKey(evt) {
		if (evt.key == 'Enter') {
			let value = this.state.inputValue;
			if (value == '') {
				value = this.props.instance.inputHistory.getLastEntered();
			} else if (value != this.props.instance.inputHistory.getLastEntered()) {
				this.props.instance.inputHistory.add(value);
			}

			this.props.instance.connection.send(value);
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
