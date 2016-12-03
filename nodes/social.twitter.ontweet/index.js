module.exports = function(FLUX) {

	function constr(NODE) {

		let twitterIn = NODE.addInput('twitter', {
			type: 'social.twitter'
		});

		let triggerOut = NODE.addOutput('trigger', {
			type: 'trigger'
		});

		let tweetOut = NODE.addOutput('tweet', {
			type: 'social.twitter.tweet'
		});

		let textOut = NODE.addOutput('text', {
			type: 'string'
		});

		tweetOut.on('trigger', (conn, state, callback) => {

			let thisState = state.get(this);
			callback((thisState && thisState.tweet) || null);

		});

		textOut.on('trigger', (conn, state, callback) => {

			let thisState = state.get(this);
			callback((thisState && thisState.tweet && thisState.tweet.text) || null);

		});

		NODE.on('init', (state) => {

			let type = NODE.data.type;
			if (!type) {
				return;
			}

			NODE.getValuesFromInput(twitterIn, state).then((twitters) => {

				twitters.forEach((twitter) => {

					twitter.stream(type, (stream) => {

						stream.on('data', (data) => {

							state.set(this, {
								tweet: data
							});
							NODE.triggerOutputs(triggerOut, state);

						});

						stream.on('end', () => {

						});

						stream.on('destroy', () => {

						});

					});

				});

			});

		});

	}

	FLUX.addNode('social.twitter.ontweet', {
		type: 'event',
		level: 0,
		groups: ['social']
	}, constr);

};