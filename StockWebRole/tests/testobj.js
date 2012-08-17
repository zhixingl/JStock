// testobj.js
var n = 12;
var x = {};
var arr = [1,2,3];
console.log(typeof(n));
console.log(typeof(x));
console.log(typeof(arr));
console.log(typeof(new Array()));

console.log(Number.MIN_VALUE);

var propNames = ['id','link'];

var myObj = {'id': '1', 'link': 'my link', num: 12};

for(var i = 0; i < propNames.length; i ++){
	delete myObj[propNames[i]];
}

console.log(myObj);