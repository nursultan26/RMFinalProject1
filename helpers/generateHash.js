/* returns hash based on provided string */
module.exports = function(data) {
	let crypto = require('crypto');
	var salt = 'somemetorsalt';
	var current_date = (new Date()).valueOf().toString();
	var random = Math.random().toString();
	var hash = crypto.createHash('sha1').update(data + salt).digest('hex');
	return hash;
}