// testjutils.js
var jutils = require('../jutils.js')
var myArr = [2,3,5,1,9];
var myArr2 = [{num:2}, {num:5},{num:6},{num:7},{num:1}];

console.log(jutils.max(myArr));
console.log(jutils.max(myArr2, 'num'));

console.log(jutils.min(myArr));
console.log(jutils.min(myArr2, 'num'));