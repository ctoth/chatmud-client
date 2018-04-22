import "./ui.css";
const React = require("react");
import Modal from "react-accessible-modal";
const SettingsPanel = require("./settingspanel");

class OptionsDialog extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			isOpened:false
		}
		this.showSettings = this.showSettings.bind(this);
		this.hideSettings = this.hideSettings.bind(this);
	}
	
	render() {
		if (this.state.isOpened) {
			return (
			<div>
			<Modal isOpen={true} label="Settings" onRequestClose={this.hideSettings}>
			<SettingsPanel />
			</Modal>
			</div>
			);
		} else {
			return (
			<div class="settings-button">
			<button onClick={this.showSettings}>Settings</button>
			</div>
			);
		}
		
	}
	
	showSettings() {
		this.setState({
			isOpened:true
		});
		
		
		}
	
	hideSettings() {
		this.setState({
			isOpened:false
		});
		
	}
		
}

module.exports = OptionsDialog;