
/**
 * Module dependencies
 */

const express = require('express');


const http = require('http');
const path = require('path');
const app = module.exports = express();



/*
*
* Middleware
*
*/

const morgan = require('morgan');
const errorHandler = require('errorhandler');



/*
*
* Configuration
*
*/

if (app.get('env') === 'development') {
	app.use(errorHandler({ dumpExceptions: true, showStack: true }));
	app.locals.pretty = true;
	app.use(morgan('dev'));
}
else {
	app.use(errorHandler());
	app.use(morgan());
}

// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', __dirname + '/views');
app.set('view engine', 'jade');


var staticOptions = {
	maxAge: 1000 * 60 * 60 * 24 * 7 // 7 days
};

app.use(express.static(path.join(__dirname, 'public'), staticOptions));
app.use(express.static(path.join(__dirname, 'bower_components'), staticOptions));

app.get('/:lost(public|bower_components)/:path(*)', function(req, res) {
	res.redirect(301, '/' + req.params.path);
});



/*
*
* Routes
*
*/
const routes = require('./routes');



app.get('/partials/:name', routes.partial);
app.get('/', routes.index);




// redirect all others to the index (HTML5 history)
app.get('*', routes.index);



/**
* Start Server
*/

console.log(Date.now(), 'Running Node.js ' + process.version + ' with flags "' + process.execArgv.join(' ') + '"');
http.createServer(app).listen(app.get('port'), function() {
  console.log(Date.now(), 'Express server listening on port ' + app.get('port'));
});
