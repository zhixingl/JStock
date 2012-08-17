// testbuyer.js
var Buyer = require('../workers/buyer');
var http = require('http');
var util = require('util');

var agent = http.globalAgent;
agent.maxSockets = 50;
agent.on('connect', function() {
	  util.log('Socket: ' + agent.sockets.length + '/' + agent.maxSockets +  ' queued: '+ agent.queue.length);
});

var urlTemplate = 'http://money.finance.sina.com.cn/quotes_service/api/xml.php/CN_MarketData.getKLineData?symbol=%s&scale=30&datalen=196';
var buyer = new Buyer();

var code = 'sz002049';
var url = util.format(urlTemplate, code);

buyer.sendBuyOneRequest(code, url, function(band){
	// console.log(band);
});


 // buyer.run();

 // setInterval(buyer.run, 5*60*1000);