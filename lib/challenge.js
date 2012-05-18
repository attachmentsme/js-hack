var sexy = require('sexy-args'),
	mongodb = require('mongodb');

function Challenge(params) {
	sexy.args([this, 'object1'], {
		object1: {
			database: 'js-hack',
			collection: 'challenges',
			host: '127.0.0.1',
			port: 27017,
			clientLoaded: false
		}
	}, function() {
		sexy.extend(this, params);
		this._initMongo();
	});
}

Challenge.prototype.close = function() {
	if (this.server) {
		try {
			this.server.close();
		} catch (e) {
			console.warn(e);
		}
	}
};

Challenge.prototype._initMongo = function() {
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

Challenge.prototype.getChallengeByIndex = function(index, callback) {
	var _this = this;
	
	if (!this.clientLoaded) {
		setTimeout(function() {
			_this.getChallengeByIndex(index, callback);
		}, 500);
		return;
	}
	
	var collection = new mongodb.Collection(this.client, this.collection);
	collection.findOne({}, function(err, object) {
		if (err) {
		 	callback({});
		} else {
			callback(object.challenges[index]);
		}
	});
};

exports.Challenge = Challenge;