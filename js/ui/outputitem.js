const React = require("react");
const open=require('open');

class OutputItem extends React.Component {
	constructor(props) {
		super(props);
		//this.re=/(http|ftp|https):\/\/([\w_-]+(?:(?:\.[\w_-]+)+))([\w.,@?\^=%:\/~+#-]*[\w@?\^=%\/~+#-])?/gi;
		this.re=/((?:http|ftp|https):\/\/(?:[\w_-]+(?:(?:\.[\w_-]+)+))(?:[\w.,@?\^=%:\/~+#-]*[\w@?\^=%\/~+#-])?)/gi;
	}
	itemize(text) {
		const split = text.split(this.re);
		if(split.length==1) {
			return <div>{split[0]}</div>;
		}
		return split.map((item, index) => {
			const re=this.re; //parcel doesn't let me use this.re directly for some odd reason
			return (
				re.test(item) ? <a href={item} onClick={(e) => this.openLink(e,item)}>{item}</a> : item
			);
		});
	}
	openLink(event, link) {
		event.preventDefault();
		open(link);
	}
	render() {
		return <div>{this.itemize(this.props.text)}</div>;
	}
}

module.exports = OutputItem;