var express = require('express');
var router = express.Router();

var request = require('request');
const cheerio = require('cheerio')
const utf8 = require('utf8');

module.exports = function(app, db) {

	var books = []

	function addBooks(link) {
		request({uri: link, method:'GET', encoding: 'binary'}, function (err, res, page) {
			let $ = cheerio.load(page, { decodeEntities: false });

			var title = utf8.decode($('h1 .entry-title').text())
			var description = utf8.decode($('div .entry-content').children().last().text())
			var imgLink = $('div .et_post_meta_wrapper').find('img').attr('src')
			console.log(title)
			books.push({
				title,
				description,
				imgLink
			});
		})
	}	
	router.get('/',function(req, res) {

		function callb(cb,hr) {
			request({uri: 'http://books.kg/rnews/page/' + i, method:'GET', encoding:'binary'}, function (err, res, page) {
				let $ = cheerio.load(page, { decodeEntities: true });
				$('div .et_pb_image_container').each(function(index,elem) {
					elem = $(elem).find('a')
					elem = utf8.decode($(elem).attr('href'))
					cb(elem)
				});
				hr()
			});
		}

		for (var i = 1; i <= 3; i++) {
			callb(function(elem) {
				addBooks()
			}, function() {
				console.log(elem)
			})
		}

		res.send()
	});


	router.get('/single',function(req, res) {
		var values = parseSingleBook('https://mybook.ru/author/rao-lu/dnevnik-blazhenstva/').then(function(resolve){
			res.send(resolve)
		})
	})

	var parseSingleBook = function(url) {
		var promise = new Promise(function(resolve, reject) {
			request({uri: url, method:'GET', encoding:'binary'}, function (err, res, page) {
				let $ = cheerio.load(page, { decodeEntities: false });
				var title = utf8.decode($('div .book-page-book-name').text())
				var description = utf8.decode($('div .definition-section').children().first().text())
				var imgLink = $('div .book-cover').find('img').attr('src')

				resolve({
					title,
					description,
					imgLink
				})
			});
		});

		return promise
	}


	app.use('/parse', router);
};