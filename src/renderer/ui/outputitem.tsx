import React from 'react';
import open from 'opn';
import YouTube from 'react-youtube-player';
import { ResolvingLink } from './resolvinglink';

interface Properties {
  text: string;
}
export class OutputItem extends React.Component {
  re = /((?:http|ftp|https):\/\/[\w-]+(?:\.[\w-]+)+(?:[\w#%+,./:=?@^~-]*[\w#%+/=?@^~-])?)/gi;
  props: Properties;
  shouldComponentUpdate(nextProperties, nextState) {
    if (this.props.text === nextProperties.text) {
      return false;
    }
    return true;
  }

  itemize(text) {
    const split = text.split(this.re);
    if (split.length === 1) {
      return <div>{split[0]}</div>;
    }
    return split.map((item, index) => {
      const re = this.re; // Parcel doesn't let me use this.re directly for some odd reason
      return re.test(item) ? this.parseLink(item, index) : item;
    });
  }

  openLink(event, link) {
    event.preventDefault();
    open(link);
  }

  parseLink(item, key) {
    if (item.includes('youtube.com/watch')) {
      return this.parseYoutubeLink(item);
    }
    return (
      <ResolvingLink
        key={key}
        url={item}
        onClick={event => this.openLink(event, item)}
      />
    );
  }

  parseYoutubeLink(item) {
    let id = item.split('v=')[1];
    const andPosition = id.indexOf('&');
    if (andPosition !== -1) {
      id = id.slice(0, Math.max(0, andPosition));
    }
    return <YouTube key={id} videoId={id} />;
  }

  render() {
    return <div>{this.itemize(this.props.text)}</div>;
  }
}
