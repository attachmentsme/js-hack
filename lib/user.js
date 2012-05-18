var sexy = require('sexy-args'),
	mongodb = require('mongodb'),
	underscore = require('underscore'),
	Challenge = require('./challenge').Challenge,
	ChallengeRunner = require('./challenge-runner').ChallengeRunner;

function User(params) {
	sexy.args([this, 'object1'], {
		object1: {
			database: 'js-hack',
			collection: 'users',
			host: '127.0.0.1',
			port: 27017,
			clientLoaded: false
		}
	}, function() {
		sexy.extend(this, params);
		this._initMongo();
	});
}

User.prototype._initMongo = function() {
	var _this = this;
	
	this.server = new mongodb.Server(this.host, this.port, {});
	
	new mongodb.Db(this.database, this.server, {autoReconnect: true}).open(function (error, client) {
		if (error) {
			setTimeout(function() {
				_this._initMongo()
			}, 1000);
			return;
		}
		_this.client = client;
		_this.clientLoaded = true;
	});
};

User.prototype.save = function(userObject, callback) {
	var _this = this;
		
	if (!this.clientLoaded) {
		setTimeout(function() {
			_this.save(userObject, callback);
		}, 500);
		return;
	}
	
	var updateObject = underscore.clone(userObject),
		_id = updateObject.id || updateObject._id || updateObject.github_id;
	delete updateObject.id;
	delete updateObject._id;
	
	var collection = new mongodb.Collection(this.client, this.collection);
	collection.update({_id: _id}, {$set: updateObject}, {upsert: true}, function(err, object) {
		if (err) {
		 	callback({});
		} else {
			callback(object);
		}
	});
};

User.prototype.getUserByGithubId = function(githubId, callback) {
	var _this = this;
	
	if (!this.clientLoaded) {
		setTimeout(function() {
			_this.getUserByGithubId(githubId, callback);
		}, 500);
		return;
	}
	
	var collection = new mongodb.Collection(this.client, this.collection);
	collection.findOne({_id: githubId}, function(err, object) {
		if (err) {
		 	callback({});
		} else {
			callback(object);
		}
	});
};

User.prototype.getHighScores = function(callback) {
	var _this = this;
	
	if (!this.clientLoaded) {
		setTimeout(function() {
			_this.getUserByGithubId(githubId, callback);
		}, 500);
		return;
	}
	
	var collection = new mongodb.Collection(this.client, this.collection);
	collection.find().sort({points: -1}).toArray(function(err, results) {
		if (err) {
		 	callback([]);
		} else {
			var scores = [];
			results.forEach(function(result) {
				scores.push({
					user_id: result._id,
					points: result.points,
					gravatar_id: result.gravatar_id
				});
			});
			callback(scores);
		}
	});
};

User.prototype.getAllChallenges = function(userDocument, callback) {
	if (userDocument.challenges.length) {
		callback(userDocument.challenges);
		return;
	}
	this.getNextChallenge(userDocument, callback);
};

User.prototype.getNextChallenge = function(userDocument, callback) {
	var c = new Challenge({host: this.host, database: this.database, port: this.port}),
		_this = this;
	c.getChallengeByIndex(userDocument.currentChallenge, function(challenge) {
		userDocument.currentChallenge++;
		
		if (challenge) {
			challenge.started = (new Date()).getTime();
			userDocument.challenges.push(challenge);
		}
		
		_this.save(userDocument, function() {
			
			try {
				c.close();
			} catch(e) {
				console.warn(e);
			}
			
			if (challenge) {
				callback(userDocument.challenges, challenge.filename);
			} else {
				callback(null);
			}
		});
	});
};

User.prototype.getChallengeByFilename = function(userDocument, filename) {
	for (var i = 0, challenge; (challenge = userDocument.challenges[i]) != null; i++) {
		if (challenge.filename === filename) {
			return challenge;
		}
	}
	return {};
};

User.prototype.updateChallengeCode = function(userDocument, filename, code, callback) {
	for (var i = 0, challenge; (challenge = userDocument.challenges[i]) != null; i++) {
		if (challenge.filename === filename) {
			challenge.code = code;
		}
	}
	
	this.save(userDocument, callback);
};

User.prototype.skipChallenge = function(userDocument, filename, callback) {
	this.getNextChallenge(userDocument, function(challenges, newFile) {
		var message = 'coding challenge ' + filename + ' has been skipped, no points rewarded.';
		if (newFile) {
			message += "\ngiven new challenge: " + newFile;
		} else {
			message += "\nCongratulations, you've completed all the curent challenges.\n Don't worry, more are on their way."
		}
		callback(message);
	});
};

User.prototype.runChallengeByFilename = function(userDocument, filename, callback) {
	var c = null,
		index = 0,
		_this = this;
		
	for (var i = 0, challenge; (challenge = userDocument.challenges[i]) != null; i++) {
		if (challenge.filename === filename) {
			index = i;
			c = challenge;
			break;
		}
	}
	
	if (!c) {
		callback('-bash: ' + filename + ': command not found');
		return;
	}
	
	var challengeRunner = new ChallengeRunner({
		code: c.code,
		inputs: underscore.clone( c.inputs )
	}, function(results) {
		var message = '';
		if (results.success) {
			if (userDocument.currentChallenge === (index + 1) ) {
				
				var timeBonus = _this.addTimeBonus(userDocument, c),
					codeQualityModifier = _this.addCodeQualityModifier(userDocument, c, results);

				userDocument.points += challenge.basePoints;
					
				message += "You Passed the Challenge! \n" + results.message;
				_this.getNextChallenge(userDocument, function(challenges, filename) {
					message += "\n" + c.basePoints + ' pts rewarded for completing challenge';
					message += "\n" + timeBonus + ' pts rewarded for time bonus';
					message += "\n" + codeQualityModifier + ' pts code quality modifier';

					if (filename) {
						message += "\ngiven new challenge: " + filename;
					} else {
						message += "\nCongratulations, you've completed all the curent challenges.\n Don't worry, more are on their way.";
					}
					callback(message);
				});
			} else {
				message += "You Passed the Challenge!\n" + results.message;
				callback(message);
			}
		} else {
			message += "Challenge failed:\n" + results.message;
			callback(message);
		}
	});
}

User.prototype.addCodeQualityModifier = function(userDocument, challenge, challengeRunner) {
	var lines = parseFloat( ('' + challengeRunner.code).replace(/([^\/"']+|"(?:[^"\\]|\\.)*"|'(?:[^'\\]|\\.)*')|\/\*(?:[^*]|\*+[^*\/])*\*+\/|\/\/.*/, '').split('\n').length );
	var codeQualityModifier = parseInt( (0.5 - ( parseFloat( challengeRunner.lintErrors ) / lines)) * parseFloat( challenge.basePoints ) );
	userDocument.points += codeQualityModifier;
	return codeQualityModifier;
};

User.prototype.addTimeBonus = function(userDocument, challenge) {
	var finished = (new Date()).getTime(),
		timeBonus = 0.0,
		time = parseFloat(challenge.time);
	
	if (finished - challenge.started < time) {
		timeBonus = parseInt( ( time / ( parseFloat(finished) - parseFloat(challenge.started) + time ) ) * challenge.basePoints );
	}
	userDocument.points += timeBonus;
	return timeBonus;
};

exports.User = User;