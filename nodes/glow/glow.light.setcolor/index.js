function hexToRgb(hex) {

	let result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
	return result ? {
		r: parseInt(result[1], 16),
		g: parseInt(result[2], 16),
		b: parseInt(result[3], 16)
	} : null;

}

function rgbToHsv(r, g, b) {

	if (arguments.length === 1) {

		g = r.g;
		b = r.b;
		r = r.r;

	}

	let max = Math.max(r, g, b);
	let min = Math.min(r, g, b);
	let d = max - min;
	let h;
	let s = (max === 0 ? 0 : d / max);
	let v = max / 255;

	switch (max) {
		case min:
			h = 0;
			break;
		case r:
			h = (g - b) + d * (g < b ? 6 : 0);
			h /= 6 * d;
			break;
		case g:
			h = (b - r) + d * 2;
			h /= 6 * d;
			break;
		case b:
			h = (r - g) + d * 4;
			h /= 6 * d;
			break;
	}

	return {
		h: h * 360,
		s: s * 100,
		v: v * 100
	};

}

module.exports = function(NODE) {

	let triggerIn = NODE.getInputByName('trigger');
	let lightIn = NODE.getInputByName('light');
	let colorIn = NODE.getInputByName('color');

	let doneOut = NODE.getOutputByName('done');

	triggerIn.on('trigger', (conn, state) => {

		colorIn.getValues(state).then((hexColors) => {

			if (!hexColors.length) {

				doneOut.trigger(state);
				return;

			}

			let colors = [];
			hexColors.forEach((hexColor) => {

				let rgb = hexToRgb(hexColor);
				let hsv = rgbToHsv(rgb);

				colors.push(hsv);

			});

			//for now
			let color = colors[0];

			lightIn.getValues(state).then((lights) => {

				let duration = +NODE.data.duration || 0;
				if (duration) {

					NODE.addProgressBar({
						percentage: 0,
						updateOverTime: duration,
						timeout: duration + 700
					});

				}

				Promise.all(lights.map((light) => light.connected && light.setColor(color.h, color.s, color.v, duration)))
					.then(() => doneOut.trigger(state));

			});

		});

	});

};