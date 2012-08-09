//parent.js
var cp = require('child_process');

var n = cp.fork('./child.js');
console.log('PID= ' + n.pid);

setTimeout(function(){
	//i ++;
	console.log('I will exit');

	process.exit(-1);

}, 5000);

// print process.argv
process.argv.forEach(function (val, index, array) {
  console.log(index + ': ' + val);
});

//n.send('message', {msg: 'How are you?'});