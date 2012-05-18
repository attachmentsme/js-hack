var Challenge = require('../lib').Challenge,
	equal = require('assert').equal;

exports.tests = {
	'test 1st challenge can be loaded': function(finished, prefix) {
		var challenge = new Challenge();
		challenge.getChallengeByIndex(1, function(challenge) {
			equal('reverse-array.js', challenge.filename, prefix + ' first challenge not loaded.');
			finished();
		});
	}
};