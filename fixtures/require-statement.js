var mongodb = require('mongodb'),
	server = new mongodb.Server("127.0.0.1", 27017, {});

new mongodb.Db('js-hack', server, {}).open(function (error, client) {
	if (error) throw error;
	var collection = new mongodb.Collection(client, 'users');
	collection.insert({hello: 'world'}, {safe:true}, function(err, objects) {
		if (err) console.warn(err.message);
		if (err && err.message.indexOf('E11000 ') !== -1) {
			// this _id was already inserted in the database
		}
	});
});