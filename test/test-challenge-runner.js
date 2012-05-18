var ChallengeRunner = require('../lib').ChallengeRunner,
	equal = require('assert').equal,
	Challenge = require('../lib').Challenge,
	fs = require('fs'),
	fixtures = {
		'infiniteLoop': fs.readFileSync('./fixtures/infinite-loop.js'),
		'process': fs.readFileSync('./fixtures/process.js'),
		'requireStatement': fs.readFileSync('./fixtures/require-statement.js'),
		'reverse': fs.readFileSync('./fixtures/reverse.js'),
		'clean': fs.readFileSync('./fixtures/clean-code.js'),
		'dirty': fs.readFileSync('./fixtures/dirty-code.js')
	};

exports.tests = {
	'code should terminate execution if in an infinite loop': function(finished, prefix) {
		var challengeRunner = new ChallengeRunner({
			code: fixtures.infiniteLoop,
			timeout: 250,
			inputs: [{input: [3, 4, 5, 6], output: [6, 5, 4, 3]}]
		}, function(results) {
			equal(false, challengeRunner.success, prefix + ' execution of infinite loop did not cause failure.');
			finished();
		});
	},
	
	'a require statement should not be tolerated in sandboxed code': function(finished, prefix) {
		var challengeRunner = new ChallengeRunner({
			code: fixtures.requireStatement,
			timeout: 250,
			inputs: [{input: [3, 4, 5, 6], output: [6, 5, 4, 3]}]
		}, function(results) {
			equal(false, challengeRunner.success, prefix + ' require method was available.');
			finished();
		});
	},
	
	'proccess should not be avalable in script': function(finished, prefix) {
		var challengeRunner = new ChallengeRunner({
			code: fixtures.process,
			timeout: 250,
			inputs: [{input: [3, 4, 5, 6], output: [6, 5, 4, 3]}]
		}, function(results) {
			equal(false, challengeRunner.success, prefix + ' process object was available.');
			finished();
		});
	},
	
	'if all outputs are correct success is true': function(finished, prefix) {
		var challengeRunner = new ChallengeRunner({
			code: fixtures.reverse,
			timeout: 250,
			inputs: [
				{input: [3, 4, 5, 6], output: [6, 5, 4, 3]},
				{input: [1, 2, 3, 4], output: [4, 3, 2, 1]}
			]
		}, function(results) {
			equal(true, challengeRunner.success, prefix + ' script did not have expected output.');
			finished();
		});
	},
	
	'one bad output should cause the challenge to fail': function(finished, prefix) {
		var challengeRunner = new ChallengeRunner({
			code: fixtures.reverse,
			timeout: 250,
			inputs: [
				{input: [3, 4, 5, 6], output: [6, 5, 4, 3]},
				{input: [3, 4, 5, 6], output: [6, 5, 4, 3]},
				{input: [1, 2, 3, 4], output: [4, 3, 2, 0]}
			]
		}, function(results) {
			equal(false, challengeRunner.success, prefix + ' script did not have expected output.');
			finished();
		});
	},
	
	'we should be able to execute a challenge stored in the challenges collection': function(finished, prefix) {
		(new Challenge()).getChallengeByIndex(0, function(challenge) {
			var challengeRunner = new ChallengeRunner({
				code: challenge.code,
				inputs: challenge.inputs
			}, function(results) {
				equal(false, results.success, prefix + ' executing challenge was not successful.');
				finished();
			});
		});
	},
	
	'clean code should have less errors than dirty code': function(finished, prefix) {
		var challengeRunner = new ChallengeRunner({
			code: fixtures.clean,
			timeout: 250,
			inputs: []
		}, function(r1) {
			var challengeRunner = new ChallengeRunner({
				code: fixtures.dirty,
				timeout: 250,
				inputs: []
			}, function(r2) {
				equal(true, r2.lintErrors > r1.lintErrors, prefix + ' linting did not work properly.');
				finished();
			});
		});
	}

};