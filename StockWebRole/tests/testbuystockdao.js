var eyes = require('eyes');
var azure = require('azure');
var BuyStockDao = require('../model/buystockdao.js');

module.exports = function(){

	var tableName = 'BuyStocks';
	

	var buyStockDao = new BuyStockDao(tableName);

	var stock = {};
		stock.code = "sz000712";
		stock.name = "PFYH";
		stock.buyDate = Date.now();
		stock.buyPrice = 7.68;
		stock.buyVolume = 1000;

	this.newItem = function(){
		//eyes.inspect(stock);
		buyStockDao.newItem(stock, function(error, entity, response){
			eyes.inspect(error);
			//eyes.inspect(entity);
			//eyes.inspect(response);
		});
	};

	this.getAllItems = function(){
		buyStockDao.getAllItems(function(error, entities){
			eyes.inspect(error);
			//eyes.inspect(entities);
			buyStockDao.retrieveExtraData(entities, function(){
				entities.forEach(function(item){
					console.log(item.code + ', ' + item.currPrice + ',' + item.tunePrice);
				});
			});
		});
	};

	this.getItem = function(){
		buyStockDao.getItem(stock.code, function(error, entity){
			//if(error){
				eyes.inspect(error);
			//}else{
				eyes.inspect(entity);
			//}
		});
	};

	this.removeItem = function(){
		buyStockDao.removeItem(stock.code, function(error, successful){
			if(error){
				util.log(error);
			}else{
				eyes.inspect(successful);
			}
		});
	};

	this.deleteAll = function(callback){
		// buyStockDao.deleteAll('BuyStocks', callback);
		buyStockDao.deleteAll('SellStocks1', callback);
		buyStockDao.deleteAll('SellStocks2', callback);
	};

	return this;
}