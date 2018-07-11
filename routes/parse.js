var express = require('express');
var router = express.Router();

var request = require('request');
const cheerio = require('cheerio')
const utf8 = require('utf8');
var async = require('async')

module.exports = function(app, db) {



	var addBooks = function(link) {
		var promise = new Promise(function(resolve, reject) {
			request({uri: link, method:'GET', encoding: 'binary'}, function (err, res, page) {

				let $ = cheerio.load(page, { decodeEntities: true });

				var title = utf8.decode($('div .et_post_meta_wrapper').find('h1').text())
				if (title == "Колыбельная звезд Карен Уайт") {
					var description = utf8.decode($('div .js-text').text())
				} else {
				var description = utf8.decode($('div .entry-content').find('p').text())
				}
				var imgLink = $('div .et_post_meta_wrapper').find('img').attr('src')

				resolve({
					title,
					author: "",
					description,
					imgLink
				});
			});		
		});

		return  promise
	}	


	router.get('/',function(req, res) {
		
		var books = []

		request({uri: 'http://localhost:3000/parse/pages', method:'GET', encoding: 'binary'}, function (err, response, urls) {
			console.log('urls', urls)
			urls = JSON.parse(urls)
			async.eachSeries(urls, function iterator(url, callback) {
				addBooks(url).then(function(resolve, reject) {
					db.Book.create(resolve)

					books.push(resolve)
					callback()
				})
			}, function() {
				res.send(books)
			});	
		});	
	});

	router.get('/pages',function(req, res) {

		var urls = []
		var ids = []

		for (var i = 1; i <= 1; i++) {
			ids.push(i)
		}

		async.eachSeries(ids, function iterator(id, callback) {	
			request({uri: 'http://books.kg/rnews/page/' + id, method:'GET', encoding:'binary'}, function (err, res, page) {
				let $ = cheerio.load(page, { decodeEntities: true });
				let elem = $('div .et_pb_image_container').each(function(index,elem) {
					elem = $(elem).find('a')
					elem = utf8.decode($(elem).attr('href'))
					urls.push(elem)
				});
				callback()
			});	
		}, function() {
			res.send(urls)
		});
	});

	app.use('/parse', router);
};