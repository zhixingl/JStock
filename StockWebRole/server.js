/**
 * Module dependencies.
 * @auther:Zhixing
 */

var express = require('express')
  , routes = require('./routes');
 //var eyes = require('eyes');

var app = module.exports = express.createServer();

// Configuration

app.configure(function(){
  app.set('views', __dirname + '/views');
  app.set('view engine', 'jade');
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(app.router);
  app.use(express.static(__dirname + '/public'));
});

app.configure('development', function(){
  app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
});

app.configure('production', function(){
  app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
});

// Routes

//app.get('/', routes.index);
routes(app);

//Start the stock worker
require('./stockworker.js').start();

var port = process.env.port || 3000;
app.listen(port);

app.on('listening', function(err){
	require('./workers/pinger').start(app, 3*60*1000);
  // require('./workers/pinger').start(app, 30*1000);
});

app.on('error', function(err){
  console.log('app error: ' + err);
});

console.log("Express server listening on port %d in %s mode", app.address().port, app.settings.env);
//eyes.inspect(app.settings.env);
