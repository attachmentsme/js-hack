var User = require('../lib').User,
	equal = require('assert').equal,
	mongodb = require('mongodb');

exports.tests = {
	'test saving a user': function(finished, prefix) {
		var userObject = {
			id: 'userid',
			gravatar_id: '299399340',
			github_id: '132342334'
		};
		
		var user = new User({database: 'hire-hack-test'});
		user.save(userObject, function() {
			finished();
		});
	},
	
	'test loading a user': function(finished, prefix) {
		var user = new User({database: 'hire-hack-test'}),
			score = Math.random() * 1000,
			userObject = {
				id: 'userid',
				gravatar_id: '299399340',
				github_id: '132342334',
				score: score
			};
		
		user.save(userObject, function() {
			user.getUserByGithubId('userid', function(user) {
				equal(user.gravatar_id, '299399340', prefix + ' did not load user successfully.');
				equal(user.score, score, prefix + ' did not load user successfully.');
				finished();
			});
		});
	}
};