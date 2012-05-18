var User = require('./user').User,
	express = require('express'),
	util = require('util'),
	everyauth = require('everyauth');

exports.start = function(environment, publicDirectory) {
	
	var user = new User({
		host: environment.mongoHost,
		port: environment.mongoPort,
		database: environment.mongoDatabase
	});

	everyauth.github
		.appId(environment.appId)
		.appSecret(environment.appSecret)
		.findOrCreateUser( function (session, accessToken, accessTokenExtra, githubUserMetadata) {
			var userObject = {
				id: githubUserMetadata.id,
				gravatar_id: githubUserMetadata.gravatar_id,
				name: githubUserMetadata.name,
				login: githubUserMetadata.login
			};
			return userObject;
		})
		.getSession( function(req, res) {
			user.getUserByGithubId(res.oauthUser.login, function(userDocument) {
				if (!userDocument) { // Create the user if they don't exist.
					user.save({
						challenges: [],
						github_id: res.oauthUser.login,
						gravatar_id: res.oauthUser.gravatar_id,
						currentChallenge: 0,
						points: 0
					}, function() {});
				}
			});
			req.session.githubId = res.oauthUser.login;
			return {}
		})
		.callbackPath(environment.prefix + '/auth/github/callback')
		.entryPath(environment.prefix + '/auth/github')
		.redirectPath(environment.prefix + '/public/computer.html')
		.moduleErrback( function (err, data) {} );

	var routes = function (app) {
		app.get(environment.prefix + '/challenges', function(req, res){
			user.getUserByGithubId(req.session.githubId, function(userDocument) {
				if (userDocument && userDocument.github_id) {

					if (req.query.filename) {
						res.contentType('application/json');
						res.send(JSON.stringify(user.getChallengeByFilename(userDocument, req.query.filename)));
					} else {
						user.getAllChallenges(userDocument, function(challenges) {
							res.contentType('application/json');
							res.send(JSON.stringify(challenges));
						});
					}

				} else {
						user._initMongo();
						res.contentType('application/json');
						res.send(JSON.stringify({auth: true}));
				}
			});
		});

		app.post(environment.prefix + '/challenges', function(req, res) {
			user.getUserByGithubId(req.session.githubId, function(userDocument) {
				if (userDocument && userDocument.github_id) {
					if (req.body.filename && req.body.code) {
						user.updateChallengeCode(userDocument, req.body.filename, req.body.code, function() {
							res.contentType('application/json');
							res.send(JSON.stringify({success: true}));
						});
					}
				} else {
					user._initMongo();
					res.contentType('application/json');
					res.send(JSON.stringify({auth: true}));	
				}
			});
		});

		app.post(environment.prefix + '/run_challenge', function(req, res) {
			user.getUserByGithubId(req.session.githubId, function(userDocument) {
				if (userDocument && userDocument.github_id) {
					if (req.body.filename) {
						user.runChallengeByFilename(userDocument, req.body.filename, function(message) {
							res.contentType('application/json');
							res.send(JSON.stringify({message: message}));
						});
					}
				} else {
					user._initMongo();
					res.contentType('application/json');
					res.send(JSON.stringify({auth: true}));	
				}
			});
		});

		app.post(environment.prefix + '/skip_challenge', function(req, res) {
			user.getUserByGithubId(req.session.githubId, function(userDocument) {
				if (userDocument && userDocument.github_id) {
					if (req.body.filename) {
						user.skipChallenge(userDocument, req.body.filename, function(message) {
							res.contentType('application/json');
							res.send(JSON.stringify({message: message}));
						});
					}
				} else {
					user._initMongo();
					res.contentType('application/json');
					res.send(JSON.stringify({auth: true}));	
				}
			});
		});

		app.get(environment.prefix + '/user', function(req, res) {
			user.getUserByGithubId(req.session.githubId, function(userDocument) {
				if (userDocument && userDocument.github_id) {
					res.contentType('application/json');
					res.send(JSON.stringify({user: userDocument}));
				} else {
					user._initMongo();
					res.contentType('application/json');
					res.send(JSON.stringify({auth: true}));	
				}
			});
		});

		app.get(environment.prefix + '/scores', function(req, res) {
			user.getHighScores(function(scores) {
				res.contentType('application/json');
				res.send(JSON.stringify(scores));
			});
		});

	};

	var app = express.createServer();
	
	app.configure(function(){
		app.use(express.cookieParser());
		app.use(express.bodyParser());
		app.use(express.session({secret: environment.salt}));
		app.use(everyauth.middleware());
		app.use(express.router(routes));
		app.use(environment.prefix + '/public', express.static( publicDirectory ));
	});

	app.on('error', function(e) {
		console.log(e);
	});
	
	console.log('Public Directory ' + publicDirectory)
	console.log('Listening on ' + environment.host + ':' + environment.port)
	app.listen(environment.port, environment.host);
};