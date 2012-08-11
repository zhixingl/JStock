var StockCalculator = require('./stockcalculator.js');
var http = require('http');
var xml2js = require('xml2js');
var eyes = require('eyes');
var util = require('util');
var StockDao = require('./model/stockdao.js');


var urlTemplate = 'http://money.finance.sina.com.cn/quotes_service/api/xml.php/CN_MarketData.getKLineData?symbol=%s&scale=30&datalen=196';
var code = 'sh600518';
var url = util.format(urlTemplate, code);
test1();
// test2();

function test1(){
	var buyTableName = 'BuyStocks';
		// , sellTableName1 = 'SellStocks1';
		  // , partitionKey = 'StockPartition'
		  // , accountName = 'zxnodestorage'
		  // , accountKey = 'g8VByq/98xY0jibr4RVHvN4/4Czxh1tVpIH7OnP9h9KixC4f62SltDGk6OFq8AXuDSGDMOFEXZs3ZWAi98e2Xw==';	
	var buyStockDao = new StockDao(buyTableName);	
	buyStockDao.getAllItems(function(error, entities){
		// console.log('Start get all items ' + entities.length);
		if(error){
			eyes.inspect(error);
		}else{
			entities.forEach(function(stock){
				var url = util.format(urlTemplate, stock.code);
				getSellValues(url, stock.code);
			});
		}
	});
}

function getSellValues(url, code){
// console.log(url);
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
					//eyes.inspect(items.length);
					
					if(items != undefined && items.length >0){
						var length = items.length;
						
						var calculator = new StockCalculator(items);


						console.log('['+ code + '] MA0: ' + calculator.MA0() + ','
								+ 'MA1: ' + calculator.MA1().toFixed(2) + ','
								+ 'MA2: ' + calculator.MA2().toFixed(2) + ','
								+ 'MA3: ' + calculator.MA3().toFixed(2) + ','
								+ 'MA4: ' + calculator.MA4().toFixed(2) + ','
								+ 'BUY1: ' + calculator.BUY1() + ','
								+ 'SELL1: ' + calculator.SELL1() + ','
								+ 'BUY2: ' + calculator.BUY2() + ','
								+ 'SELL2: ' + calculator.SELL2() 
							);
						
						
					}else{
						//console.log('This stock %s does not exist!', code);
					}
				});
				//console.log(resData);
				parser.parseString(resData);	
			});
		}

		res.on('error', function(err){
			eyes.inspect(err);
		});
	});
}


function test2(){
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
					//eyes.inspect(items.length);
					
					if(items != undefined && items.length >0){
						var length = items.length;
						
						var calculator = new StockCalculator(items);

	/*					console.log("get the EMA values");
						debugger;
						// var value = calculator.EMA(5);
						eyes.inspect(calculator.EMA(5));
						eyes.inspect(calculator.EMA(12));
						eyes.inspect(calculator.EMA(50));
						eyes.inspect(calculator.EMA(89));
						eyes.inspect(calculator.EMA(144));
						
						console.log("get the MA0 values");
						
						eyes.inspect(calculator.MA0(items[length - 1]));
						eyes.inspect(calculator.MA0(items[length - 2]));

						console.log("get the MA1 values");
						//eyes.inspect(calculator.MA1());
						
						eyes.inspect(calculator.MA1(items[length - 1]));
						eyes.inspect(calculator.MA1(items[length - 2]));
						eyes.inspect(calculator.MA1(items[length - 3]));
						eyes.inspect(calculator.MA1(items[length - 4]));
						eyes.inspect(calculator.MA1(items[length - 5]));
						eyes.inspect(calculator.MA1(items[length - 6]));
						eyes.inspect(calculator.MA1(items[length - 7]));
						eyes.inspect(calculator.MA1(items[length - 8]));
						eyes.inspect(calculator.MA1(items[length - 9]));
						eyes.inspect(calculator.MA1(items[length - 10]));
						eyes.inspect(calculator.MA1(items[length - 11]));
						eyes.inspect(calculator.MA1(items[length - 12]));
						eyes.inspect(calculator.MA1(items[length - 13]));
						eyes.inspect(calculator.MA1(items[length - 14]));



						console.log("get the MA2 values");
						eyes.inspect(calculator.MA2(items));
						eyes.inspect(calculator.MA2(items.slice(0, -1)));
						eyes.inspect(calculator.MA2(items.slice(0, -2)));
						eyes.inspect(calculator.MA2(items.slice(0, -3)));
						eyes.inspect(calculator.MA2(items.slice(0, -4)));
						eyes.inspect(calculator.MA2(items.slice(0, -5)));
						eyes.inspect(calculator.MA2(items.slice(0, -6)));
						eyes.inspect(calculator.MA2(items.slice(0, -7)));
						eyes.inspect(calculator.MA2(items.slice(0, -8)));
						eyes.inspect(calculator.MA2(items.slice(0, -9)));

						
						//eyes.inspect(calculator.MA2());
						
						console.log("get the MA3 values");
						//eyes.inspect(calculator.MA3());
						eyes.inspect(calculator.MA3(items));
						eyes.inspect(calculator.MA3(items.slice(0, -1)));
						eyes.inspect(calculator.MA3(items.slice(0, -2)));
						eyes.inspect(calculator.MA3(items.slice(0, -3)));
						eyes.inspect(calculator.MA3(items.slice(0, -4)));


						console.log("get the MA4 values");
						eyes.inspect(calculator.MA4(items));
						eyes.inspect(calculator.MA4(items.slice(0, -1)));
						eyes.inspect(calculator.MA4(items.slice(0, -2)));
						eyes.inspect(calculator.MA4(items.slice(0, -3)));
						eyes.inspect(calculator.MA4(items.slice(0, -4)));

						console.log("get the BUY1 value");
						eyes.inspect(calculator.BUY1());
						console.log("get the BUY2 value");
						eyes.inspect(calculator.BUY2());
						console.log("get the SELL1 value");
						eyes.inspect(calculator.SELL1());
						console.log("get the SELL2 value");
						eyes.inspect(calculator.SELL2());
*/							
						var calculator = new StockCalculator(items);
						eyes.inspect('SELL1= ' + calculator.SELL1());
						eyes.inspect('SELL2= ' + calculator.SELL2());

						// for(var i = items.length ; i > items.length- 10; i --){
						// 	var calculator = new StockCalculator(items.slice(0, i));
						// 	eyes.inspect('MA0= ' + calculator.MA0());
						// 	eyes.inspect('MA1= ' + calculator.MA1());
						// 	eyes.inspect('MA2= ' + calculator.MA2());
						// 	eyes.inspect('MA3= ' + calculator.MA3());
						// 	eyes.inspect('MA4= ' +calculator.MA4());
						// 	eyes.inspect(calculator.MA0() < calculator.MA3());
						// 	console.log('-------------------------------');

						// }

						console.log('['+ code + '] MA0: ' + calculator.MA0() + ','
								+ 'MA1: ' + calculator.MA1().toFixed(2) + ','
								+ 'MA2: ' + calculator.MA2().toFixed(2) + ','
								+ 'MA3: ' + calculator.MA3().toFixed(2) + ','
								+ 'MA4: ' + calculator.MA4().toFixed(2) + ','
								+ 'BUY1: ' + calculator.BUY1() + ','
								+ 'SELL1: ' + calculator.SELL1() + ','
								+ 'BUY2: ' + calculator.BUY2() + ','
								+ 'SELL2: ' + calculator.SELL2() 
							);

						// console.log('get bandwidth');
						// console.log(calculator.getBandWidth());

						// console.log('['+ code + '] MA0: ' + calculator.MA0() + ','
						// 		+ 'MA1: ' + calculator.MA1().toFixed(2) + ','
						// 		+ 'MA2: ' + calculator.MA2().toFixed(2) + ','
						// 		+ 'MA3: ' + calculator.MA3().toFixed(2) + ','
						// 		+ 'MA4: ' + calculator.MA4().toFixed(2) + ','
						// 		+ 'BUY1: ' + calculator.BUY1() + ','
						// 		+ 'SELL1: ' + calculator.SELL1() + ','
						// 		+ 'BUY2: ' + calculator.BUY2() + ','
						// 		+ 'SELL2: ' + calculator.SELL2() 
						// 	);
						
						
					}else{
						//console.log('This stock %s does not exist!', code);
					}
				});
				//console.log(resData);
				parser.parseString(resData);	
			});
		}

		res.on('error', function(err){
			eyes.inspect(err);
		});
	});	

}