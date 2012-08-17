// seller.js

var http = require('http'),
	util = require('util'),
    // eyes = require('eyes'),
    xml2js = require('xml2js');

var StockCalculator = require('../stockcalculator.js');
var StockDao = require('../model/stockdao.js');
var azure = require('azure');   

module.exports = Seller;

function Seller(){}

Seller.prototype.run = function(){


	processAllItems();
	//setTimeout(this.run, 30*60*1000);

	util.log('Seller is running......');
};

function processAllItems(){
	var buyTableName = 'BuyStocks'
		, sellTableName2 = 'SellStocks2';

	var urlTemplate = 'http://money.finance.sina.com.cn/quotes_service/api/xml.php/CN_MarketData.getKLineData?symbol=%s&scale=30&datalen=196';
	var buyStockDao = new StockDao(buyTableName);
	var sellStockDao = new StockDao(sellTableName2);

	buyStockDao.getAllItems(function(error, entities){
		// console.log('Start get all items ' + entities.length);
		if(error){
			util.log(error);
		}else{
			entities.forEach(function(stock){
				var url = util.format(urlTemplate, stock.code);
				sendSellRequest(buyStockDao, sellStockDao, stock, url);
			});
		}
	});

}


function sendSellRequest(buyStockDao, sellStockDao, stock, url){
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

										var ema5 = calculator.EMA(5);
										var sell1 = calculator.SELL1();
										var sell2 = calculator.SELL2();
										var params = {
											realPrice: realPrice,
											SELL1: sell1,
											SELL2: sell2,
											EMA5: ema5,
											minBandwidth: band.minBandwidth,
											maxBandwidth: band.maxBandwidth
										};

										var con1 = require('./sellcons/con1.js')(items, stock, realPrice, params);
										var con2 = require('./sellcons/con2.js')(items, stock, realPrice, params);
										var con3 = require('./sellcons/con3.js')(items, stock, realPrice, params);
										var con4 = require('./sellcons/con4.js')(items, stock, realPrice, params);
										var con5 = require('./sellcons/con5.js')(items, stock, realPrice, params);
										var con6 = require('./sellcons/con6.js')(items, stock, realPrice, params);
										var con7 = require('./sellcons/con7.js')(items, stock, realPrice, params);
										var con8 = require('./sellcons/con8.js')(items, stock, realPrice, params);

										util.log(stock.code + ': con1 = ' + con1
													 + ', con2= ' + con2
													 + ', con3= ' + con3
													 + ', con4= ' + con4
													 + ', con5= ' + con5
													 + ', con6= ' + con6
													 + ', con7= ' + con7
													 + ', con8= ' + con8);
										console.log(params);

										if(con1 || con2 || con3 || con4 || con5 || con6 || con7 || con8){
											util.log('Start to sell this stock: ' + stock.code);
											stock.sellPrice = realPrice;
											stock.sellPriceAvg = realPrice;//平均卖出价格
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
		util.log('Seller: ' + err.message);
	});

}


function sellStock(buyStockDao, sellStockDao, stock){
	stock.sellDate = Date.now();

	sellStockDao.getItem(stock.code, function(err, entity){
		if(err){
			sellStockDao.newItem(stock, function(error){
				if(error){	//Has never been sold before
					util.log('Cannot insert new sell stock item with code ' + stock.code + ', the error code is ' + error.code);
				}else{
					util.log('Insert new sell stock item successfully, and the code is ' + stock.code );
					buyStockDao.removeItem(stock.code, function(err){
						if(err){
							util.log('Cannot remove item');
						}
					});
				}
			});
		}else{
			stock.sellVolume += entity.sellVolume;
			stock.sellPriceAvg = (stock.sellPriceAvg + entity.sellPriceAvg)/2;
			sellStockDao.updateItem(stock,function(error){
				if(error){	//Has never been sold before
					util.log('Cannot update new sell stock item with code ' + stock.code + ', the error code is ' + error.code);
				}else{
					util.log('Update new sell stock item successfully, and the code is ' + stock.code );
					buyStockDao.removeItem(stock.code, function(err){
						if(err){
							util.log('Cannot remove item');
						}
					});
				}
			});

		}
	});

}