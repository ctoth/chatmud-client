const React = require('react');
const open = require('opn');
const YouTube = require('react-youtube-player').default;
const ResolvingLink = require('./resolvinglink');

class OutputItem extends React.Component {
	constructor(props) {
		super(props);
		// This.re=/(http|ftp|https):\/\/([\w_-]+(?:(?:\.[\w_-]+)+))([\w.,@?\^=%:\/~+#-]*[\w@?\^=%\/~+#-])?/gi;
		this.re = /((?:http|ftp|https):\/\/(?:[\w_-]+(?:(?:\.[\w_-]+)+))(?:[\w.,@?\^=%:\/~+#-]*[\w@?\^=%\/~+#-])?)/gi;
	}

	shouldComponentUpdate(nextProps, nextState) {
		if (this.props.text === nextProps.text) {
			return false;
		}
		return true;
	}
	itemize(text) {
		const split = text.split(this.re);
		if (split.length == 1) {
			return <div>{split[0]}</div>;
		}
		return split.map((item, index) => {
			const re = this.re; // Parcel doesn't let me use this.re directly for some odd reason
			return (
				re.test(item) ? this.parseLink(item, index) : item
			);
		});
	}

	openLink(event, link) {
		event.preventDefault();
		open(link);
	}

	parseLink(item, key) {
		if (item.indexOf('youtube.com/watch') != -1) {
			return this.parseYoutubeLink(item);
		}
		return (<ResolvingLink key={key} url={item} onClick={e => this.openLink(e, item)}/>);
	}

	parseYoutubeLink(item) {
		let id = item.split('v=')[1];
		const andPosition = id.indexOf('&');
		if (andPosition != -1) {
		  id = id.substring(0, andPosition);
		}
		return <YouTube key={id} videoId={id} />;
	}

	render() {
		return <div>{this.itemize(this.props.text)}</div>;
	}
}

module.exports = OutputItem;
