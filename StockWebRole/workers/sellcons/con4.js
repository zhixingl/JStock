// con4.js

/**
* 买入后，若出现弱势卖出信号（卖1=50 or卖2=50）且收盘价跌破expma（c，5）时，卖出；
*/
module.exports = function(items, stock, realPrice, params){

	return (params.SELL1 == 50 || params.SELL2 == 50) && (realPrice < params.EMA5);

}