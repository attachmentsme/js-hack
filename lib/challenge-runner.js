var sexy = require('sexy-args'),
	Sandbox = require('sandbox'),
	underscore = require('underscore'),
	lint = require('jslint/lib/linter').lint;

function ChallengeRunner(params, callback) {
	sexy.args([this, 'object1', 'function1'], {
		object1: {
			timeout: 1000,
			code: '',
			inputs: [],
			success: true,
			inputsToCheck: 3,
			inputsChecked: 0,
			lintErrors: 9999
		}
	}, function() {
		sexy.extend(this, params);
		this.lintCode();
		this.callback = callback;
		this.sandBox = new Sandbox({
			timeout: this.timeout
		});
		this.runCode();
	});
}

ChallengeRunner.prototype.lintCode = function() {
	try {
		this.lintErrors = Math.max( lint('' + this.code).errors.length - 3, 0);
	} catch (e) {
		console.warn(e);
	}
};

ChallengeRunner.prototype.runCode = function() {
	if (this.inputs.length == 0 || ++this.inputsChecked > this.inputsToCheck) {
		this.callback(this);
		return;
	}
	
	var _this = this,
		input = this.inputs.splice( parseInt(Math.random() * this.inputs.length), 1 )[0]; // Grab a random element.
	
	this.sandBox.run('var input = ' + JSON.stringify(input.input) + ';  (function (input) {\n' + this.code + '\n}(input));', function(results) {
		_this.processResults(results, input);
		if (_this.success) {
			_this.runCode();
		} else {
			_this.callback(_this);
		}
	});
};

ChallengeRunner.prototype.processResults = function(results, input) {
	results = results || {};
	results.result = results.result || 'Error: unknown error.';
	
	if (results.result.indexOf('Error') > -1) {
		this.success = false;
		this.message = results.result;
	} else {
		var output = results.result;
		try {
			output = JSON.parse( results.result.replace(/'/g, '"') );
		} catch (e) {
			console.log(e);
		}
		this.success = underscore.isEqual(output, input.output);
		this.message = 'script outputted: ' + results.result;
	}
};

exports.ChallengeRunner = ChallengeRunner;