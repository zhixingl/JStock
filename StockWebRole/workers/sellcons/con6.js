// con6.js

/**
* 买入后，若累计涨幅>2%，则从上到下跌破2%卖出；
*/
module.exports = function(items, stock, realPrice, params){
	var buyPrice = stock.buyPrice;
	var buyDate = new Date(parseInt(stock.buyDate));
	var length = items.length;

	var item;
	var newDate;
	var max = 0;

	for(var i  = length - 1; ; i--){
		item = items[i];
		newDate = new Date(item.day + '+08:00');
		if(max < item.high){
			max = item.high;
		}

		if(newDate < buyDate){
			break;
		}

	}

	return ((max - buyPrice) / buyPrice > 0.02) && ((realPrice - buyPrice) / buyPrice < 0.02);
	// return ((realPrice - buyPrice) / buyPrice > 0.02) && (realPrice < (max - max*0.02));

}