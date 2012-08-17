// testargs.js
callMe('a', 'b', function(){console.log('hello')});
function callMe(){
	console.log(arguments);
	arguments[2].call();
}