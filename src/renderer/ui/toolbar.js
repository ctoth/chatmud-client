import './ui.css';

const React = require('react');
const SettingsPanel = require('./settingspanel');
const OnlineList = require('./onlinelist');

class ToolBar extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			isSettingsOpened: false,
			isOnlineListOpened: false
		};
		this.showSettings = this.showSettings.bind(this);
		this.hideSettings = this.hideSettings.bind(this);
		this.showOnlineList = this.showOnlineList.bind(this);
		this.hideOnlineList = this.hideOnlineList.bind(this);
	}

	render() {
		return (
			<div>
				{this.renderButtons()}
				{this.renderSettings()}
				{this.renderOnlineList()}
			</div>
		);
	}

	showSettings() {
		this.setState({
			isSettingsOpened: true,
			isOnlineListOpened: false
		});
	}

	hideSettings() {
		this.setState({
			isSettingsOpened: false,
			isOnlineListOpened: false
		});
	}

	renderButtons() {
		const buttons = [];

		if (this.state.isSettingsOpened == true) {
			buttons.push(<button key="1" onClick={this.hideSettings} aria-expanded="true">Settings</button>);
		} else {
			buttons.push(<button key="2" onClick={this.showSettings} aria-expanded="false">Settings</button>);
		}

		if (this.state.isOnlineListOpened) {
			buttons.push(<button key="3" onClick={this.hideOnlineList} aria-expanded="true">Online List</button>);
		} else {
			buttons.push(<button key="5" onClick={this.showOnlineList} aria-expanded="false">Online List</button>);
		}
		return (
			<div className="toolbar">
				{buttons}
			</div>
		);
	}

	showOnlineList() {
		this.setState({
			isOnlineListOpened: true,
			isSettingsOpened: false
		});
	}

	hideOnlineList() {
		this.setState({
			isOnlineListOpened: false,
			isSettingsOpened: false
		});
	}

	renderSettings() {
		if (this.state.isSettingsOpened) {
			return (
				<div>

					<div className="settings-panel">
						<SettingsPanel instance={this.props.instance}/>
					</div>

				</div>
			);
		}
	}

	renderOnlineList() {
		if (this.state.isOnlineListOpened) {
			return (
				<div>

					<div>
						<OnlineList />
					</div>

				</div>
			);
		}
	}
}

module.exports = ToolBar;
