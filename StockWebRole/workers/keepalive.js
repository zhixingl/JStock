// keepalive.js
var config = require('../config.js');
var cp = require('child_process');

module.exports.start = function(){
	var files = config.workers;
	console.log(files);
	files.forEach(function(file){
		console.log(file);
		var n = cp.fork(file);
		var pid = n.pid;
		config.runnings.push({pid: file});
	});
}

module.exports.check = function(){
	var runnings = config.runnings;
	runnings.forEach(function(running, index){
		console.log(running + ': ' + index);
	});
}