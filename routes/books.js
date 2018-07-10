var express = require('express');
var router = express.Router();
var sendEmail = require('../helpers/sendEmail')

/* libraries for photo upload */
var multer = require('multer');
var upload = multer({dest: './public/img'});

module.exports = function(app, conn) {

	router.get('/',function(req, res) {
		var sql = "select * FROM Book;";
		conn.query(sql, function (err, books) {
			res.render('books', {books});
		})
	});


	router.post('/add', upload.any(), function(req, res) {
		console.log(req.files)
		var sql = "Insert into Book (Title, Author, Description, Image) values ('%Title', '%Author', '%Description', '%Image')"
		sql = sql.replace('%Title', req.body.title)
		sql = sql.replace('%Author', req.body.author)
		sql = sql.replace('%Description', req.body.description)
		sql = sql.replace('%Image', req.files[0].filename)

		conn.query(sql, function (err, books) {
			res.send(req.body)
		})

	});
	
	app.use('/books', router);
};