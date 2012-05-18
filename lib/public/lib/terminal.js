function HireHack() {
	this.maxHighScores = 100;
	this.prefix = 'js-hack';
	this.commands = [];
	this.poppedCommands = [];
	this.loadFileTerminal();
	this.attachClickEvents();
	this.attachKeyboardEvents();
	$('#terminalSuffix').focus();
	this.showHelp();
	this.getUserInfo();
	this.startScoreboardTimer();
	this.populateFileTerminalPromptWithUsernameAndPath('DanReedx86', '~/chainChomp');
}

HireHack.prototype.getUserInfo = function() {
	var _this = this;
	this.request({
		url: '/' + _this.prefix + '/user',
		type: 'get',
		success: function(results) {
			_this.populateFileTerminalPromptWithUsernameAndPath(results.user._id, '~/js-scripts/');
		}
	});
};

HireHack.prototype.showHelp = function() {
	this.addLineToTerminal('HIRE~HACK (TM) Attachments.me 2012');
	this.addLineToTerminal('');
	this.addLineToTerminal('Show off your JavaScript skills, complete the coding challenges:');
	this.addLineToTerminal('');
	this.addLineToTerminal('&nbsp;>&nbsp;bonus points are rewarded for speed and code quality.');
	this.addLineToTerminal("&nbsp;>&nbsp;data is passed into your scripts as the var 'input'");
	this.addLineToTerminal('&nbsp;>&nbsp;compare yourself to other hackers on the scoreboard.');
	this.addLineToTerminal('');
	this.addLineToTerminal('----------------');
	this.addLineToTerminal('');
	this.addLineToTerminal('ls: view your current challenges.');
	this.addLineToTerminal('vi [challenge-name]: edit a challenge.');
	this.addLineToTerminal('&nbsp;:w - save a challenge.');
	this.addLineToTerminal('&nbsp;:q - quit editor.');
	this.addLineToTerminal('[challenge-name]: run the challenge.');
	this.addLineToTerminal('skip [challenge-name]: give up on a challenge.');
	this.addLineToTerminal('points: view your current points.');
	this.addLineToTerminal('help: show these options.');
}

HireHack.prototype.startScoreboardTimer = function() {
	var _this = this;
	this.updateScore();
	setInterval(function() {
		_this.updateScore();
	}, 60000);
};

HireHack.prototype.updateScore = function() {
	var _this = this;
	this.request({
		url: '/' + this.prefix + '/scores',
		type: 'get',
		success: function(scores) {
			$('#score-container li').remove();
			for (var i = 0, score; (score = scores[i]) != null; i++) {
				var element = $('<li />');
				var link = $('<a class="gravatar" />').attr({
					href: 'https://github.com/' + score.user_id,
					target: '_blank'
				});
				var gravatar = $('<img />').attr({
					src: 'https://secure.gravatar.com/avatar/' + score.gravatar_id + '?s=32'
				});
				link.append( gravatar );
				var name = $('<div class="info" />').text(score.user_id);
				var points = $('<div class="info" />').text(score.points + ' pts');
				element.append(link);
				element.append(name);
				element.append(points);
				$('#score-container').append(element);
				
				if ( i > _this.maxHighScores) {
				  break;
				}
			}
		}
	});
};

HireHack.prototype.attachClickEvents = function() {
	var _this = this;
	
	$('#powerButton.off').live('click', function() {
		$('#powerButton').removeClass('off');
		$('#cl').show();
		$('#terminalSuffix').focus();
		_this.showHelp();
	});
	
	$('#powerButton:not(.off)').live('click', function() {
		$('#powerButton').addClass('off');
		$('#cl').hide();
		$('#editor').hide();
		$('#fileTerminal').find('*').remove();
		$('#fileTerminal').text('');
	});
	
	$('#cl').live('click', function() {
		$('#terminalSuffix').focus();
	});
};

HireHack.prototype.attachKeyboardEvents = function() {
	var _this = this;
	
	$('#textEditorTerminalSuffix:visible').live('keydown', function(event) {
		if (event.keyCode == 13) {
			var command = $('#terminalSuffix:visible, #textEditorTerminalSuffix:visible').val(); 
			$('#terminalSuffix:visible, #textEditorTerminalSuffix:visible').val('');
			_this.handleCommand(command);
		}
	});
	
	$('#terminalSuffix:visible').live('keydown', function(event) {
		if (event.keyCode == 13) {
			var command = $('#terminalSuffix:visible, #textEditorTerminalSuffix:visible').val(); 
			$('#terminalSuffix:visible, #textEditorTerminalSuffix:visible').val('');
			_this.commands.push.apply(_this.commands, _this.poppedCommands);
			_this.handleCommand(command);
		} else if (event.keyCode == 38) {
			var command = _this.commands.pop();
			_this.poppedCommands.push(command);
			$('#terminalSuffix').val(command);
		} else if (event.keyCode == 40) {
			var command = _this.poppedCommands.pop();
			_this.commands.push(command);
			$('#terminalSuffix').val(command);
		}
	});
	
	$('#editorTerminal:focus').live('keydown', function(event) {
		if (event.keyCode == 9) {
			return false;
		} else if (event.keyCode == 27) {
			$('#textEditorTerminalPrefix').text(':w :q $');
			$('#textEditorTerminalSuffix').focus();
		}
	});

	$('#textEditorTerminalSuffix:focus').live('keydown', function(event) {
		if (event.keyCode == 27) {
			$('#textEditorTerminalPrefix').text('-- INSERT --');
			$('#editorTerminal').focus();
		}
	});
	
	$('#textEditorTerminalSuffix').live('focus', function(event) {
		$('#textEditorTerminalPrefix').text(':w :q $');
	});
	
	$('#editorTerminal').live('focus', function(event) {
		$('#textEditorTerminalPrefix').text('-- INSERT --');
	});
};

HireHack.prototype.handleCommand = function(command) {
	var _this = this;
	
	if ($('#terminalSuffix:visible').length) {
		this.commands.push(command);
	}
	
	if (command.indexOf('edit') > -1 || command.indexOf('vi') > -1 || command.indexOf('vim') > -1) {
		$('#textEditorTerminalPrefix').text('-- INSERT --');
		var filename = command.split(' ')[1];
		this.request({
			url: '/' + _this.prefix + '/challenges',
			type: 'get',
			data: {filename: filename},
			success: function(challenge) {
				if (challenge.filename) {
					_this.challenge = challenge;
					_this.editChallenge();
					$('#editorTerminal').focus();
				} else {
					_this.addLineToTerminal('-vi: could not open ' + filename + ' for editing');
				}
			}
		});
	} else if (command == 'points') {
		this.request({
				url: '/' + _this.prefix + '/user',
				type: 'get',
				success: function(user) {
					_this.addLineToTerminal('You have ' + user.user.points + ' pts');
				}
		});
	} else if (command == ':w') {
		_this.addLineToTerminal('-vi: editing: ' + _this.challenge.filename);
		this.request({
				url: '/' + _this.prefix + '/challenges',
				type: 'post',
				data: {filename: _this.challenge.filename, code: $('#editorTerminal').val()}
		});
	} else if (command == ':q') {
		$('#editorTerminal').focus();
		_this.loadFileTerminal();
		_this.addLineToTerminal('-vi: finished editing: ' + _this.challenge.filename);
		$('#terminalSuffix').focus();
	} else if (command == 'ls') {
		_this.request({
			url: '/' + _this.prefix + '/challenges',
			type: 'get',
			success: function(challenges) {
				for (var i = 0, challenge; (challenge = challenges[i]) != null; i++) {
					_this.addLineToTerminal(challenge.filename);
				}
			}
		});
	} else if (command == 'help') {
		_this.showHelp();
	} else if (command == 'auth') {
		document.location = '/' + _this.prefix + '/auth/github';
	} else if (command.indexOf('node') > -1) {
		var filename = command.split(' ')[1];
		this.run(filename);
	} else if (command.indexOf('skip') > -1) {
		var filename = command.split(' ')[1];
		_this.request({
			url: '/' + _this.prefix + '/skip_challenge',
			type: 'post',
			data: {filename: filename},
			success: function(results) {
				var messages = results.message.split('\n');
				for (var i = 0, message; (message = messages[i]) != null; i++) {
					_this.addLineToTerminal(message);
				}
			}
		});	
	} else {
		this.run( command.replace('./', '') );
	}
}

HireHack.prototype.run = function(filename) {
	var _this = this;
	
	this.request({
		url: '/' + _this.prefix + '/run_challenge',
		type: 'post',
		data: {filename: filename},
		success: function(results) {
			var messages = results.message.split('\n');
			for (var i = 0, message; (message = messages[i]) != null; i++) {
				_this.addLineToTerminal(message);
			}
		}
	});	
}

HireHack.prototype.editChallenge = function() {
	$('#cl').hide();
	$('#editor').show();
	$('#editorTerminal').val(this.challenge.code);
}

HireHack.prototype.loadFileTerminal = function() {
	$('#cl').show();
	$('#editor').hide();
};

HireHack.prototype.addLineToTerminal = function(lineText) {
	document.getElementById('fileTerminal').innerHTML += lineText + '</br>';
	document.getElementById('terminalSuffix').value = '';	
	var terminal = document.getElementById("fileTerminal");
	terminal.scrollTop = terminal.scrollHeight;
};

HireHack.prototype.populateFileTerminalPromptWithUsernameAndPath = function(username, path) {
	var terminalPromptPrefix = document.getElementById('terminalPrefix').innerHTML;
	document.getElementById('terminalPrefix').innerHTML = username + ':' + path + ' $ ';	
};

HireHack.prototype.request = function(params) {
	var success = params.success,
		_this = this;
		
	params.success = function(result) {
		if (result.auth) {
			_this.addLineToTerminal("");
			_this.addLineToTerminal('You must signup using your Github account to play:');
			_this.addLineToTerminal("type 'auth'");
		} else {
			success(result);
		}
	};
	$.ajax(params);
};