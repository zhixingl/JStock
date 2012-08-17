// con7.js

/**
* c<(maxBandwidth + minBandwidth)/2  and  c<o  and L<带宽下边际，卖出止损；
*/
module.exports = function(items, stock, realPrice, params){
	var length = items.length;
	var todayItem = items[length - 1];
	var c = todayItem.close;
	var o = todayItem.open;
	var l = todayItem.low;

	return (c < (params.maxBandwidth + params.minBandwidth)/2) && (c < o) && (l < params.minBandwidth);

}