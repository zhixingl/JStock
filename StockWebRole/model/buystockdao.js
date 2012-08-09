// buystockdao.js
var StockDao = require('./stockdao');

module.exports = BuyStockDao;


function BuyStockDao(tableName){
	StockDao.call(this, tableName);
}

BuyStockDao.prototype = new StockDao();
BuyStockDao.prototype.constructor = BuyStockDao;


