var express = require('express');
var router = express.Router();
var sendEmail = require('../helpers/sendEmail')
const config = require('../config')
var hash = require('../helpers/generateHash')

module.exports = function(app, db) {

	router.get('/signup',function(req, res) {
		res.render('signup', {});
	});

	router.get('/signin',function(req, res) {
		res.render('signin', {message: null});
	});


	router.post('/signup',function(req, res) {
		db.User.create({
	        email: req.body.email,
	        username: req.body.username,
	        password: req.body.password,
		})
		res.redirect('/');

	});

	router.post('/signin',function(req, res) {
		db.User.findAll({
		  	where: {
		   		username: req.body.username,
		    	password: req.body.password
		  	}
		}).then(user => {
			console.log(user[0].username)
			if(user.length == 0) { //result.length == 0 
				res.render('signin', {message: 'Не верный логин или пароль'})				
			} else {
				for(elem of config.admins) {
					if(elem == user[0].email) {
						res.cookie('admin', true)
					}
				}

				//save cookie
				res.cookie('user', user[0])
				//send email to user
				//sssendEmail(user[0].email, 'Subject', 'Text')
				res.redirect('/')
			}
		});
	});

	app.use('/users', router);
};