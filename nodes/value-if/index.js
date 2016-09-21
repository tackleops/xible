'use strict';

module.exports = function(FLUX) {

	function constr(NODE) {

		let conditionIn = NODE.addInput('condition', {
			type: "boolean"
		});

		let trueIn = NODE.addInput('if true');

		let falseIn = NODE.addInput('if false');

		let valueOut = NODE.addOutput('value');
		valueOut.on('trigger', (state, callback) => {

			FLUX.Node.getValuesFromInput(conditionIn, state).then((bools) => {

				if (bools.length) {

					var input;
					if (bools.some(bool => !bool)) {
						input = falseIn;
					} else {
						input = trueIn;
					}
					FLUX.Node.getValuesFromInput(input, state).then((values) => callback(values));

				} else {
					callback(null);
				}

			});

		});

	}

	FLUX.addNode('valued if', {
		type: "object",
		level: 0,
		groups: ["basics"]
	}, constr);

};
