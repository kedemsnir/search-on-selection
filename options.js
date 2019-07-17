targets = ['allweb', 'wiki', 'youtube'];
keys = ['default', 'ctrl', 'alt'];

function saveOptions(e) {
	e.preventDefault();
	keysToTargets = {};
	keys.forEach((key) => {
		keysToTargets[key] = '';
	});
	targets.forEach((target) => {
		key = document.querySelector('#' + target + '_pref').value;
		if (key != 'never') {
			if (keysToTargets[key]) {
				console.log('two targets with the same key!');
			} else {
				keysToTargets[key] = target;
			}
		}
	});
	console.log(keysToTargets);
	browser.storage.sync.set({keys: keysToTargets});
}

function restoreOptions() {
	keysToTargets = {};
	keys.forEach((key) => {
		keysToTargets[key] = '';
	});
	browser.storage.sync.set({keys: keysToTargets});
}

document.addEventListener("DOMContentLoaded", restoreOptions);
document.querySelector('form').addEventListener('submit', saveOptions);
