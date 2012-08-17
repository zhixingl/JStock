var eyes = require('eyes');
var azure = require('azure');
var StockDao = require('../model/stockdao.js');

module.exports = function(){

	var tableName = 'SellStocks2';
	

	var sellStockDao = new StockDao(tableName);

	var stock = {};
		stock.code = "sz000712";
		stock.name = "PFYH";
		stock.buyDate = Date.now();
		stock.buyPrice = 7.68;
		stock.buyVolume = 1000;

	this.newItem = function(){
		//eyes.inspect(stock);
		sellStockDao.newItem(stock, function(error, entity, response){
			eyes.inspect(error);
			//eyes.inspect(entity);
			//eyes.inspect(response);
		});
	};

	this.getAllItems = function(){
		sellStockDao.getAllItems(function(error, entities){
			// eyes.inspect(error);
			//eyes.inspect(entities);
				entities.forEach(function(item){
					 console.log(item.code + ', ' + item.sellPriceAvg + ', ' + item.sellPrice);
					// eyes.inspect(item);
				});
		});
	};

	this.getItem = function(){
		sellStockDao.getItem(stock.code, function(error, entity){
			//if(error){
				eyes.inspect(error);
			//}else{
				eyes.inspect(entity);
			//}
		});
	};

	this.removeItem = function(){
		sellStockDao.removeItem(stock.code, function(error, successful){
			if(error){
				util.log(error);
			}else{
				eyes.inspect(successful);
			}
		});
	};

	// this.deleteAll = function(callback){
	// 	sellStockDao.deleteAll('BuyStocks', callback);
	// 	sellStockDao.deleteAll('SellStocks1', callback);
	// 	sellStockDao.deleteAll('SellStocks2', callback);
	// };

	return this;
}

var seller = module.exports();
seller.getAllItems();