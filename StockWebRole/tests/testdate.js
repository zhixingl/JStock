// testdate.js
var jutils = require('../jutils');
var day = new Date();
console.log('day: ' + day);
console.log('getUTCDay: ' + day.getUTCDay());
console.log('getUTCHours: ' + day.getUTCHours());
console.log('getUTCMinutes: ' + day.getUTCMinutes());
console.log('getUTCSeconds: ' + day.getUTCSeconds());
console.log('getDay: ' + day.getDay());

var str = '2010-01-11 14:00:00';
// str.replace
var day2 = new Date('2012-08-01 00:20:00+08:00');
console.log(day2.getUTCHours());

console.log(jutils.compareDays(day, day2));

var day3 = new Date(Date.now());
console.log(day3);