// con4.js
var eyes = require('eyes');

/**
* 买入后，若累计涨幅>3%，则从上到下跌破3%卖出；
*/
module.exports = function(items, stock, realPrice, params){
	var buyPrice = stock.buyPrice;
	var buyDate = new Date(parseInt(stock.buyDate));
	var length = items.length;
	// console.log(buyDate);

	// eyes.inspect(stock);

	var item;
	var newDate;
	var max = 0;

	for(var i  = length - 1; ; i--){
		// debugger;

		item = items[i];
		// eyes.inspect(item);
		newDate = new Date(item.day + '+08:00');
		if(max < item.high){
			max = item.high;
		}

		// console.log(newDate);
		// console.log(buyDate);
		if(newDate < buyDate){
			break;
		}

	}

	return ((max - buyPrice) / buyPrice > 0.03) && ((realPrice - buyPrice) / buyPrice < 0.03);
	// return ((realPrice - buyPrice) / buyPrice > 0.03) && (realPrice < (max - max*0.03));

}