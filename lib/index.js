exports.ChallengeRunner = require('./challenge-runner').ChallengeRunner;
exports.start = require('./routes').start;
exports.User = require('./user').User;
exports.Challenge = require('./challenge').Challenge;
exports.data = {
	challenges: require('./data/challenges').challenges,
	user: require('./data/user').user,
	public: require('./data/public').public
};