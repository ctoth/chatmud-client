'use strict';

class LinkEmbedder {
	constructor() {
		this.re=/(http|ftp|https):\/\/([\w_-]+(?:(?:\.[\w_-]+)+))([\w.,@?\^=%:\/~+#-]*[\w@?\^=%\/~+#-])?/gi;
	}
	test(text) {
		return this.re.test(text);
}
split(text) {
	return text.split(this.re);
}
}

module.exports = LinkEmbedder;