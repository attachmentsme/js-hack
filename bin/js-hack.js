#!/usr/bin/env node
var cli = require('cli'),
	mongodb = require('mongodb');

cli.parse({
	start:   ['s', 'start server'],
	populate_database: ['p', 'populate database'],
	generate_public_files: ['g', 'generate environment file'],
	public_files_path:  ['p', 'path to public files', 'string', process.env.HOME + '/js-hack']
});

function createPublicFiles(directory) {
	var directories = [directory],
		publicFiles = require('js-hack').data.public,
		fs = require('fs');
	
	directories.push(directory + '/css');
	directories.push(directory + '/lib');
	directories.push(directory + '/lib/third-party');
	
	function createPublicFiles() {
		for (var key in publicFiles) {
			console.log('generating ' + key)
			fs.writeFileSync(directory + '/' + key, publicFiles[key], 'utf-8');
		}
	}
	
	(function makeDirectory(directory) {
		fs.mkdir(directory, '0777', function (err) {
			if (err) {
				console.log(err);
			}
			
			var nextDirectory = directories.shift();
			if (nextDirectory) {
				makeDirectory(nextDirectory);
			} else {
				createPublicFiles();
			}
		});
	})(directories.shift());
}

function populateMongo(options) {
	var environment = require(options.public_files_path + '/environment'),
		server = new mongodb.Server(environment.mongoHost, environment.mongoPort, {}),
		challenges = require('js-hack').data.challenges,
		user = require('js-hack').data.user;
	
	new mongodb.Db(environment.mongoDatabase, server, {autoReconnect: true}).open(function (error, client) {
		if (error) {
			console.log(error);
		} else {
			var collection = new mongodb.Collection(client, 'challenges');
			collection.insert(challenges.challenges, function(err, object) {
				if (err) {
					console.log(err);
				} else {
					collection = new mongodb.Collection(client, 'users');
					collection.insert(user.user, function(err, object) {
						if (err) {
							console.log(err);
						} else {
							console.log('Database initialized with default values.')
						}
						process.exit(0)
					});
				}
			});
		}
	});
}

cli.main(function(args, options) {
	if (options.generate_public_files) {
		createPublicFiles(options.public_files_path);
	} else if (options.populate_database) {
		populateMongo(options);
	} else if (options.start) {
		var environment = require(options.public_files_path + '/environment'),
			jshack = require('js-hack');
		jshack.start(environment, options.public_files_path);
	}
});