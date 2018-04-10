'use strict';

class LinkEmbedder {
	constructor() {
		this.re=/(http|ftp|https):\/\/([\w_-]+(?:(?:\.[\w_-]+)+))([\w.,@?\^=%:\/~+#-]*[\w@?\^=%\/~+#-])?/gi;
	}
	act(text, instance) {
		return text.replace(this.re, (url) => {
let link=document.createElement('a');
link.href=url;
link.innerText=url;
//let link=document.CreateElement('p')
instance.output.domNode.appendChild(link);
return url;
		});
}
}

module.exports = LinkEmbedder;