// con2.js

/**
* 若前两周期中出现过涨幅大于4的k线  and (H-C)>0.333*(H-L)，卖出；
*/
module.exports = function(items, stock, realPrice, params){
	var length = items.length;
	var todayItem = items[length - 1];
	var yesterdayItem = items[length - 2];
	var h = todayItem.high;
	var c = todayItem.close;
	var l = todayItem.low;

	var preC = yesterdayItem.close;
	var preO = yesterdayItem.open;
	var preIncrease = (preC - preO) / preO;

	var curC = todayItem.close;
	var curO = todayItem.open;
	var curIncrease = (curC - curO) / curO;

	return ((preIncrease > 0.04) || (curIncrease > 0.04) ) && ((h - c) > 0.333 * (h - l));

}