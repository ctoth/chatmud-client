'use strict';

class Notifier {
	constructor() {
		this.instance = null;
		Notification.requestPermission().then(result => console.log('Notification result: ' + result));
	}

	act(string, instance) {
		string = string.toString();
		this.instance = instance;
		if (this.instance.info.name != '') {
			if (string.includes(this.instance.info.name)) {
				console.log('Sending notification');
				new Notification('ChatMud', {
					body: 'You\'ve been mentioned! ' + string});
			}
		}
		return string;
	}
}

export default Notifier;
