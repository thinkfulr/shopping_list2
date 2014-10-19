var http = require('http');
var url = require('url');
var join = require('path').join;
var parse = require('url').parse;
var qs = require('querystring');
var mongoose = require('mongoose');
var items = [];

var server = http.createServer(function(req, res) {
	switch(req.method) {
		case 'POST':
			var item = ' ';
			req.setEncoding('utf8');
			req.on('data', function(chunk) {
				item += chunk;
			});
			req.on('end', function() {
				items.push(item);
				var obj = qs.parse(item);
				res.end("Added " + item + " successfully...");
			});
			break;
		case 'GET':
			items.forEach(function(item, i) {
				res.write((i + 1) + ". " + item + " added...\n");
			});
			res.end();
			break;
		case 'DELETE':
			var pathname = url.parse(req.url).pathname;
			var i = parseInt(pathname.slice(1), 10);

			if (isNaN(i)) {
        				res.statusCode = 400;
        				res.end('Item id not valid');
    			}
			else if (!items[i]) {
				res.statusCode = 404;
				res.end('Item not found');
			}
			else {
			        	items.splice(i, 1);
			        	res.end('Item deleted successfully');
			}
			break;
		case 'PUT':
			var pathname = url.parse(req.url).pathname;
			var i = parseInt(pathname.slice(1), 10);
			if(isNaN(i)) {
				res.statusCode = 400;
				res.end("Item ID invalid...");
			}	
			else if(!items[i]) {
				res.statusCode = 404;
				res.end("Item no found...");
			}
			else {
				var item = ' ';
				req.setEncoding('utf8');
				req.on('data', function(chunk) {
					item += chunk;
				});
				req.on('end', function() {
					items[i] = item;
					res.end("Item updated\n");
				});
				break;
			}
	};
});
server.listen(9000, function() {
	console.log("Server listening on port 9000...");
});

mongoose.connect('mongodb://localhost/test');

var db = mongoose.connection;
db.on('error', function callback() {
	console.error('connection error');
});
db.on('open', function callback() {
	console.error('connection success');
});
