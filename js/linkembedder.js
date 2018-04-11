'use strict';

class LinkEmbedder {
	constructor() {
		this.re=/(http|ftp|https):\/\/([\w_-]+(?:(?:\.[\w_-]+)+))([\w.,@?\^=%:\/~+#-]*[\w@?\^=%\/~+#-])?/gi;
	}
	act(text) {
		return text.replace(this.re, (url) => {
/*let link=document.createElement('a');
link.href=url;
link.innerText=url;
instance.output.domNode.appendChild(link);*/
return '<a href="'+url+'">'+url+'</a>';
		});
}
}

module.exports = LinkEmbedder;