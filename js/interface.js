class Interface {
	constructor(instance) {
		this.instance = instance;
		const audioOptsToggle = document.getElementById('audioOptsToggle');
		const audioOpts = document.getElementById('audioOpts');
		audioOptsToggle.addEventListener('click', () => {
			audioOptsToggle.setAttribute('aria-expanded', (audioOptsToggle.getAttribute('aria-expanded') == 'false' ? 'true' : 'false'));
			audioOpts.style.display = (audioOpts.style.display == 'none' ? '' : 'none');
		});
		document.getElementById('soundVolume').addEventListener('change', event => {
			console.log('Set volume to ' + event.target.value + ' percent');
			Howler.volume(Number(event.target.value) / 100);
		});
	}
}

module.exports = Interface;
