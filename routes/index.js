 "use strict";


exports.index = function(req, res) {
	const fs = require('fs');
	const path = require('path');
	const async = require('async');

	const partialsPath = path.join(process.cwd(), 'views', 'partials');

	fs.readdir(partialsPath, function(err, files) {
		async.concat(
			files,
			__renderPartial,
			function(err, partials) {
				res.render('index', {
					partials: partials
				});
			}
		);
	});



	function __renderPartial(file, callback) {
		let baseName = path.basename(file, '.jade');
		let renderPath = 'partials/' + baseName;

		res.render(renderPath, function(err, partialHtml) {
			callback(null, {renderPath: renderPath, html: partialHtml});
		});
	}

};

exports.partial = function(req, res) {
	var name = req.params.name;
	res.render('partials/' + name);
};
