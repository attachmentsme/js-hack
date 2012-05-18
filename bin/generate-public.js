#!/usr/bin/env node

// generates public.js which contains all the files under version
// control in the public folders.
var file = require('file'),
	fs = require('fs'),
	public = {},
	directories = [];

file.walkSync('lib/public', function(directory) {
	directories.push(directory);
});

directories.forEach(function(directory) {
	fs.readdir(directory, function(err, files) {
		files.forEach(function(file) {
			var path = directory + '/' + file,
				key = directory.replace('lib/public', '') ? directory.replace('lib/public', '') + '/' + file : file;
			
			if (key.indexOf('.') > -1) {
				public[key] = fs.readFileSync(path).toString();
			}
		});
	});
});

setTimeout(function() {
	console.log('Generated public.js in lib/data/')
	fs.writeFileSync('lib/data/public.js', 'exports.public = ' + JSON.stringify(public), 'utf-8');
}, 1000);
