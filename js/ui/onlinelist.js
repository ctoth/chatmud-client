'use strict';
import "./ui.css";

const React = require("react");

import {
	Accordion,
	AccordionItem,
	AccordionItemTitle,
	AccordionItemBody
} from 'react-accessible-accordion';

class OnlineList extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			people: {
				active:[],
				idlers:[],
				bots:[]
			}
			
		}
		this.people = {
			active: [],
			bots: [],
			idlers: []
		}

		this.createGroup = this.createGroup.bind(this);
		
			this.response = null;
			
	}
	
	componentWillMount() {
		this.getOnlineList();
	}
	
	getOnlineList() {
		fetch("http://chatmud.com/api/who")
		.then(response => response.json())
		.then(data => this.parseData(data));
	}
	
	parseData(data) {
		for (const item in data.list) {
			console.log("Parsing item: " + JSON.stringify(data.list[item]));
			
			if (data.list[item].flags && data.list[item].flags.includes("bot")) {
				const person = {
					name:item,
					title:data.list[item].title
				}
				this.people.bots.push(person);
			} else if (data.list[item].flags.includes("idle")) {
				const person = {
					name:item,
					title:data.list[item].title
				}
				this.people.idlers.push(person);
			} else {
				const person = {
					name:item,
					title:data.list[item].title
				}
				this.people.active.push(person);
			}
			
		}
		this.setState({
			people:this.people
		});
		
	}
	
	createGroup(title, people) {
		return (
		<div>
		<AccordionItem>
			
			<AccordionItemTitle>{title}</AccordionItemTitle>
			<AccordionItemBody>
			<ul>
			{people.map((item, index) => {
				console.log("Mapping " + item.name);
				return <li>{item.name} - {item.title}</li>
			})}
			</ul>
			</AccordionItemBody>
			</AccordionItem>
			</div>
		);
	}
	
	render() {
		return (
		<div class="settings-panel">
		<h1>Who's online</h1>
		<Accordion>
		{this.createGroup("Active", this.state.people.active)}
		{this.createGroup("Bots", this.state.people.bots)}
		{this.createGroup("Idlers", this.state.people.idlers)}
		</Accordion>
		</div>
		);
	}
	
	
}

module.exports = OnlineList;