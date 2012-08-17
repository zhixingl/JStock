// con3.js

/**
* 若(c-ref(c,1))*100/ref(c,1)>4 and出现弱势卖出信号（卖1=50 or卖2=50），卖出
*/
module.exports = function(items, stock, realPrice, params){
	var length = items.length;
	var todayItem = items[length - 1];
	var yesterdayItem = items[length - 2];
	var refC1 = yesterdayItem.close;
	var c = todayItem.close;

	return ((c - refC1)/refC1 > 0.04) && (params.SELL1 == 50 || params.SELL2 == 50);

}