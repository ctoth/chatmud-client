const {Howler} = require('howler');
const React = require('react');

import {
	Accordion,
	AccordionItem,
	AccordionItemTitle,
	AccordionItemBody
} from 'react-accessible-accordion';

class SettingsPanel extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			volume: Howler.volume()*100,
			speech: this.props.instance.tts.enabled,
			resolveLinks: true,
			embedYoutube: true,
			sounds: true
		};

		this.handleVolumeChange = this.handleVolumeChange.bind(this);
		this.handleSpeechStateChange = this.handleSpeechStateChange.bind(this);
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
						<input type="checkbox" id="speech-checkbox" onChange={this.handleSpeechStateChange} checked={this.state.speech?true:false} />

					</AccordionItemBody>
				</AccordionItem>
			</Accordion>
		);
	}

	handleVolumeChange(event) {
		const targetVolume = event.target.value;
		console.log('Target volume at ' + targetVolume / 100);
		Howler.volume(targetVolume / 100);
		this.setState({
			volume: targetVolume
		});
	}

	handleSpeechStateChange(event) {
		console.log('Target value is at ' + event.target.checked);
		this.props.instance.interface.setSpeechEnabled(event.target.checked);

		this.setState({
			speech: event.target.checked
		});
	}
}

module.exports = SettingsPanel;
