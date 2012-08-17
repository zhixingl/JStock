// con1.js

/**
* 若(h-REF(C,1))/ REF(C,1)>0.04  AND  (H-C)>0.333*(H-L) ，卖出
*/
module.exports = function(items, stock, realPrice, params){
	var length = items.length;
	var todayItem = items[length - 1];
	var yesterdayItem = items[length - 2];
	var h = todayItem.high;
	var refC1 = yesterdayItem.close;
	var c = todayItem.close;
	var l = todayItem.low;

	return ((h - refC1) / refC1 > 0.04) && ((h - c) > 0.333 * (h - l));

}