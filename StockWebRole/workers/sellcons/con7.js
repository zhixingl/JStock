// con7.js

/**
* 否则，若c>买入价 and c<ref((h+l)/2,1)  and L<expma(c,5)，则卖出；
*/
module.exports = function(items, stock, realPrice, params){
	var length = items.length;
	var todayItem = items[length - 1];
	var yesterdayItem = items[length - 2];
	var c = todayItem.close;

	var preH = yesterdayItem.high;
	var preL = yesterdayItem.low;

	var l = todayItem.low;

	return (c > stock.buyPrice) && (c < (preH + preL) / 2) && (l < params.EMA5);

}