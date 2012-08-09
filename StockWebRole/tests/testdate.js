// testdate.js
var day = new Date();
console.log('day: ' + day);
console.log('getUTCDay: ' + day.getUTCDay());
console.log('getUTCHours: ' + day.getUTCHours());
console.log('getUTCMinutes: ' + day.getUTCMinutes());
console.log('getUTCSeconds: ' + day.getUTCSeconds());

var str = '2010-01-11 14:00:00';
// str.replace
var day2 = new Date('2010-01-10 15:20:00+08:00');
console.log(day2.toUTCString());