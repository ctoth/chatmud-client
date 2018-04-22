const Howler = require("howler");
const React = require("react");

import {
	Accordion,
	AccordionItem,
	AccordionItemTitle,
	AccordionItemBody,
} from 'react-accessible-accordion';


class SettingsPanel extends React.Component {
	constructor(props) {
		super(props);
		
		this.state = {
			volume:1,
			speech:true,
			resolveLinks:true,
			embedYoutube:true,
			sounds:true
		}
		
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
			<input type="checkbox" id="speech-checkbox" onChange={this.onSpeechStateChange} value={this.state.speech} />

			</AccordionItemBody>
			</AccordionItem>
			</Accordion>
		);
	}
	
	handleVolumeChange(event) {
		const targetVolume = event.target.value;
		Howler.volume = targetVolume/100;
		this.setState({
			volume:targetVolume
		});
		
	}
	
	handleSpeechStateChange(event) {
		this.setState({
			speech:event.target.value
		});
		
	}
	
}

module.exports = SettingsPanel;