import './ui.css';

const React = require('react');
const SettingsPanel = require('./settingspanel');

class ToolBar extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			isOpened: false
		};
		this.showSettings = this.showSettings.bind(this);
		this.hideSettings = this.hideSettings.bind(this);
	}

	render() {
		if (this.state.isOpened) {
			return (
				<div>
					<div class="toolbar">
						<button onClick={this.hideSettings} aria-expanded="true">Settings</button>
					</div>
					<div class="settings-panel">
						<SettingsPanel instance={this.props.instance}/>
					</div>

				</div>
			);
		}
		return (
			<div class="toolbar">
				<button onClick={this.showSettings} aria-expanded="false">Settings</button>
			</div>
		);
	}

	showSettings() {
		this.setState({
			isOpened: true
		});
	}

	hideSettings() {
		this.setState({
			isOpened: false
		});
	}
}

module.exports = ToolBar;
