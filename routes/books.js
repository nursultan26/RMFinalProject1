var express = require('express');
var router = express.Router();
var sendEmail = require('../helpers/sendEmail')

/* libraries for photo upload */
var multer = require('multer');
var upload = multer({dest: './public/img'});

module.exports = function(app, db) {

	router.get('/',function(req, res) {
		db.Book.findAll().then(books => {
			res.render('books', {books});
		})
			
		
	});

	router.post('/add', upload.any(), function(req, res) {
		db.Book.create({
			title: req.body.title,
			author: req.body.author,
			description: req.body.description,
			imgLink: "qwe"
		})
		
		db.Book.findAll().then(books => {
			res.render('books', {books});
		})

	});
	
	app.use('/books', router);
};