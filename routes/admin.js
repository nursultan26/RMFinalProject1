var express = require('express');
var router = express.Router();

module.exports = function(app, db) {


	router.get('/',function(req, res) {
		res.render('admin')
	});

	app.use('/admin', router);
};