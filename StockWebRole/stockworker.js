var http = require('http'),
	util = require('util'),
    eyes = require('eyes'),
    azure = require('azure'),
    xml2js = require('xml2js');


var StockCalculator = require('./stockcalculator.js');
var StockDao = require('./model/stockdao.js');
// var Buyer = require('./workers/buyer');
// var Seller1 = require('./workers/seller1') ;
// var Seller2 = require('./workers/seller2');
var Seller = require('./workers/seller');
var jutils = require("./jutils.js");

// var keepalive = require('./workers/keepalive.js');

//var urlTemplate = 'http://money.finance.sina.com.cn/quotes_service/api/xml.php/CN_MarketData.getKLineData?symbol=%s&scale=30&datalen=144';

/*
600000 - 600999
601000 - 601999
000000 - 000999
002000 - 002694
*/
module.exports.start = function(){
	//set the concurrent connection number to 50
	var agent = http.globalAgent;
	agent.maxSockets = 50;
	// agent.on('connect', function() {
	//   	util.log('Socket: ' + agent.sockets.length + '/' + agent.maxSockets +  ' queued: '+ agent.queue.length);
	// });

	// var buyer = new Buyer();
	// var seller1 = new Seller1();
	// var seller2 = new Seller2();
	var seller = new Seller();


	// runWorkers(buyer.run, seller1.run, seller2.run);

	// setInterval(buyer.run, 15*60*1000);
	// setInterval(seller1.run, 10*60*1000);
	// setInterval(seller2.run, 10*60*1000);

	// setInterval(runWorkers, 5*1000);
	// var functions = [buyer.run, seller1.run, seller2.run];
	// var functions = [buyer.run, seller.run];
	var functions = [seller.run];
	runWorkers();
	setInterval(runWorkers, 3*60*1000);

	function runWorkers(){
		if(jutils.isInTradeTime(new Date())){
			var length = functions.length;
			// console.log('runWorks length: ' + length);
			for(var i = 0; i < length; i ++){
				// console.log(functions[i]);
				functions[i].call();
			}
			
		}else{
			util.log('It is not in trade time, skip this time!');
			// return;
		}
		
	}
}


