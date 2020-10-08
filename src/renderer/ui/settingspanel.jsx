import {
	Accordion,
	AccordionItem,
	AccordionItemTitle,
	AccordionItemBody
} from 'react-accessible-accordion';

import {Howler} from 'howler';
import React from 'react';

class SettingsPanel extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			volume: Howler.volume() * 100,
			speech: this.props.instance.tts.enabled,
			resolveLinks: true,
			embedYoutube: true,
			sounds: true
		};

		this.handleVolumeChange = this.handleVolumeChange.bind(this);
		this.handleSpeechStateChange = this.handleSpeechStateChange.bind(this);
		this.handleUsernameChange = this.handleUsernameChange.bind(this);
		this.handlePasswordChange = this.handlePasswordChange.bind(this);
	}

	render() {
		return (
			<Accordion>
				<AccordionItem>
					<AccordionItemTitle><h2>Audio</h2></AccordionItemTitle>
					<AccordionItemBody>
						<div>
							<label htmlFor="volume-slider">Sound volume</label>
							<input type="range" id="volume-slider" value={this.state.volume} onChange={this.handleVolumeChange} />
						</div>
					</AccordionItemBody>
				</AccordionItem>

				<AccordionItem>
					<AccordionItemTitle><h2>Speech</h2></AccordionItemTitle>
					<AccordionItemBody>

						<label htmlFor="speech-checkbox">Speech enabled</label>
						<input type="checkbox" id="speech-checkbox" onChange={this.handleSpeechStateChange} checked={Boolean(this.state.speech)} />

					</AccordionItemBody>
				</AccordionItem>
				<AccordionItem>
					<AccordionItemTitle><h2>Auto Login</h2></AccordionItemTitle>
					<AccordionItemBody>
						<div>
							<label htmlFor="username-input">Username</label>
							<input type="text" id="username-input" value={this.state.username} onChange={this.handleUsernameChange} />
						</div>
						<div>
							<label htmlFor="password-input">Username</label>
							<input type="password" id="password-input" value={this.state.password} onChange={this.handlePasswordChange} />
						</div>
					</AccordionItemBody>
				</AccordionItem>

			</Accordion>
		);
	}

	handleUsernameChange(event) {
		this.setState({
			username: event.target.value
		})
		this.saveAutoLogin();
	}

	handlePasswordChange(event) {
		this.setState({
			password: event.target.value
		})
		this.saveAutoLogin();
	}

	saveAutoLogin() {
		if (this.state.username && this.state.password) {
			this.props.instance.autoLogin.set({
				username: this.state.username,
				password: this.state.password
			});
		}
	}

	handleVolumeChange(event) {
		const targetVolume = event.target.value;
		Howler.volume(targetVolume / 100);
		this.setState({
			volume: targetVolume
		});
	}

	handleSpeechStateChange(event) {
		this.props.instance.interface.setSpeechEnabled(event.target.checked);

		this.setState({
			speech: event.target.checked
		});
	}
}

export default SettingsPanel;
