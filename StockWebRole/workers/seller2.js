// seller2.js
var http = require('http'),
	util = require('util'),
    eyes = require('eyes'),
    xml2js = require('xml2js');

var StockCalculator = require('../stockcalculator.js');
var StockDao = require('../model/stockdao.js');
var azure = require('azure');   

module.exports = Seller2;

function Seller2(){}

Seller2.prototype.run = function(){

	processAllSell1Items();		//Try to sell the stocks in Sell1

	processStopLossItems();		//stop the loss so we need to sell the stocks completely
	util.log('Seller2 is running......');
};

function processAllSell1Items(){
	var buyTableName = 'SellStocks1'
	, sellTableName2 = 'SellStocks2';
  // , partitionKey = 'StockPartition'
  // , accountName = 'zxnodestorage'
  // , accountKey = 'g8VByq/98xY0jibr4RVHvN4/4Czxh1tVpIH7OnP9h9KixC4f62SltDGk6OFq8AXuDSGDMOFEXZs3ZWAi98e2Xw==';

	var urlTemplate = 'http://money.finance.sina.com.cn/quotes_service/api/xml.php/CN_MarketData.getKLineData?symbol=%s&scale=30&datalen=196';
	
	var buyStockDao = new StockDao(buyTableName);

	var sellStockDao = new StockDao(sellTableName2);

	buyStockDao.getAllItems(function(error, entities){
		if(error){
			util.log(error);
		}else{
			entities.forEach(function(stock){
				//var stockCode = stock.code;
				var url = util.format(urlTemplate, stock.code);
				//util.log('url = ' + url);
				sendSell2Request(buyStockDao, sellStockDao, stock, url);
				//util.log(item.code);
			});
		}
	});

}

function sendSell2Request(buyStockDao, sellStockDao, stock, url){
	//util.log(url);
	util.log('sendSell2Request: ' + stock.code);
	http.get(url, function(res){
		var resData = '';
		if(res.statusCode == 200){
			res.on('data', function (chunk) {
			  resData += chunk;
			});

			res.on('end', function(){
					var parser = new xml2js.Parser();
					parser.on('end', function(result) {					
						var items = result.item;

						//eyes.inspect(items);
						if(items != undefined && items.length > 12){

							//util.log(stock.code + ': ema12 = ' + ema12);
							sellStockDao.getRealData(stock.code, function(err, realData){
								if(err){
									util.log(err);
								}else{
									var realPrice = parseFloat(realData[3]);
									// console.log(typeof(realPrice));
									if(realPrice > 0.5){ //The stock is in trading
										var calculator = new StockCalculator(items);
										var ema12 = calculator.EMA(12);
										var band = calculator.getBandWidth();
										var close = band.close;
										var min = band.minBandwidth;

										 // console.log(stock.code + ', ' + stock.sellPrice + ', ' + realPrice);

										if(realPrice < ema12 //跌破expma（c，12）
											|| (close - min) / min < - 0.01
											){
											util.log('Seller2: realPrice = ' + realPrice + ', ema12 = ' + ema12);
											util.log('Start to sell this stock: ' + stock.code + '; close=' + close + ', min=' + min);
											

											stock.sellPriceAvg = (realPrice + parseFloat(stock.sellPrice)) /2;//平均卖出价格
											stock.sellPrice = realPrice;
											stock.sellVolume = 1000;
											util.log('realPrice less than ema12 or < min 1%');
											sellStock(buyStockDao, sellStockDao, stock);
										}
									}
								}
							});							
						}else{
							//util.log('This stock %s does not exist!', code);
						}
					});
					//util.log(resData);
					parser.parseString(resData);	
			});
		}else{
			util.log(res.statusCode);
		}
	}).on('error', function(err){
		util.log('Seller2: ' + err.message);
	});
}

function processStopLossItems(){
	var buyTableName = 'BuyStocks'
		, sellTableName2 = 'SellStocks2';
	  	// , partitionKey = 'StockPartition'
	  	// , accountName = 'zxnodestorage'
	  	// , accountKey = 'g8VByq/98xY0jibr4RVHvN4/4Czxh1tVpIH7OnP9h9KixC4f62SltDGk6OFq8AXuDSGDMOFEXZs3ZWAi98e2Xw==';

	var urlTemplate = 'http://money.finance.sina.com.cn/quotes_service/api/xml.php/CN_MarketData.getKLineData?symbol=%s&scale=30&datalen=196';
	var buyStockDao = new StockDao(buyTableName);
	var sellStockDao = new StockDao(sellTableName2);

	buyStockDao.getAllItems(function(error, entities){
		// console.log('Start get all items ' + entities.length);
		if(error){
			eyes.inspect(error);
		}else{
			entities.forEach(function(stock){
				var url = util.format(urlTemplate, stock.code);
				sendStopLossRequest(buyStockDao, sellStockDao, stock, url);
			});
		}
	});

}


function sendStopLossRequest(buyStockDao, sellStockDao, stock, url){
	//util.log(url);
	// util.log('sendSell1Request: ' + stock.code);
	var today = new Date();
	var buyDate = new Date(parseInt(stock.buyDate));
	if(today.getDate() == buyDate.getDate())	{
		util.log('Defend T+1 rule, return directly');
		return;
	}

	http.get(url, function(res){
		var resData = '';
		if(res.statusCode == 200){
			res.on('data', function (chunk) {
			  resData += chunk;
			});

			res.on('end', function(){
					var parser = new xml2js.Parser();
					parser.on('end', function(result) {					
						var items = result.item;
						//eyes.inspect(items);
						if(items != undefined && items.length > 0){
							sellStockDao.getRealData(stock.code, function(err, realData){
								if(err){
									util.log(err);
								}else{

									var realPrice = parseFloat(realData[3]).toFixed(2);
									// util.log('Seller1 realPrice: ' + realPrice);
									if(realPrice > 0.5){ //The stock is in trading
										var calculator = new StockCalculator(items);
										var band = calculator.getBandWidth();
										var close = band.close;
										var min = band.minBandwidth;

										if((close - min) / min < - 0.01){//止损
										//if(stock.code == 'sh600028'){
											util.log('Start to sell this stock: ' + stock.code + '; close=' + close + ', min=' + min);
											stock.sellPrice = realPrice;
											stock.sellPriceAvg = realPrice;
											stock.sellVolume = 1000;
											sellStock(buyStockDao, sellStockDao, stock);
										}
									}
								}
							});
						}else{
							//util.log('This stock %s does not exist!', code);
						}
					});
					//util.log(resData);
					parser.parseString(resData);	
			});
		}else{
			util.log(res.statusCode);
		}
	}).on('error', function(err){
		util.log('Seller2: ' + err.message);
	});

}

function sellStock(buyStockDao, sellStockDao, stock){
	stock.sellDate = Date.now();
	
//Now let's insert the new record
	//eyes.inspect(stock);
	sellStockDao.newItem(stock, function(error){
		if(error){
			util.log('Cannot insert new sell stock item with code ' + stock.code + ', the error code is ' + error.code);
		}else{
			util.log('Insert new sell stock item successfully, and the code is ' + stock.code );
		}
	});

	buyStockDao.removeItem(stock.code, function(err){
		if(err){
			util.log('Cannot remove item');
		}
	});

}