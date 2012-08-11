// buystockdao.js
var StockDao = require('./stockdao');
var jutils = require('../jutils');
var azure = require('azure'),
	async = require('async'),
	http = require('http'),
	util = require('util'),
	xml2js = require('xml2js');

module.exports = BuyStockDao;


function BuyStockDao(tableName){
	StockDao.call(this, tableName);
}

BuyStockDao.prototype = new StockDao();
BuyStockDao.prototype.constructor = BuyStockDao;

BuyStockDao.prototype.getAllItems = function (callback) {
	util.log('[BuyStockDao]: getAllItems');
	var self = this;
	var query = azure.TableQuery
	    .select('code,buyDate,buyPrice,buyVolume')
	    .from(self.tableName);
	    //.where('completed eq ?', 'false');
	self.storageClient.queryEntities(query, function(error, entities){
		if(entities && entities.length > 0){
		    jutils.sortEntities(entities);

		    //set the real price
/*		    async.forEach(entities
	           , function(entity, callback1){
	               entity.name = entity.code;
	               //now get the current price
	               var realUrl = 'http://hq.sinajs.cn/?list=' + entity.code;
	               http.get(realUrl, function(response) {
	                  // eyes.inspect(res);
	                   if(response.statusCode == 200){
	                       var resData = '';
	                       response.on('data', function (chunk) {
	                           resData += chunk;
	                       });                            
	                       response.on('end', function(){
	                           eval(resData);
	                           var realData = eval('hq_str_' + entity.code).split(',');
	                           entity.currPrice = parseFloat(realData[3]).toFixed(2);
	                           //console.log( entity.currPrice);
	                           callback1(null);
	                       });
	                       response.on('error', function(err){
	                           callback1(err);
	                       });
	                   }
	               });
	           }
	           , function(error){

	               if(error){
	               		callback(error);
	               }else{
	               		 retrieveTunePrice(entities,callback);
	               		 // callback(error, entities);
	               }
	               // callback(error, entities);
	           }
	        );*/

			callback(error, entities);
		
	    }
	});        
};

BuyStockDao.prototype.retrieveExtraData = function(entities, callback){
		    //set the real price
		    async.forEach(entities
	           , function(entity, callback1){
	               entity.name = entity.code;
	               //now get the current price
	               var realUrl = 'http://hq.sinajs.cn/?list=' + entity.code;
	               http.get(realUrl, function(response) {
	                  // eyes.inspect(res);
	                   if(response.statusCode == 200){
	                       var resData = '';
	                       response.on('data', function (chunk) {
	                           resData += chunk;
	                       });                            
	                       response.on('end', function(){
	                           eval(resData);
	                           var realData = eval('hq_str_' + entity.code).split(',');
	                           entity.currPrice = parseFloat(realData[3]).toFixed(2);
	                           //console.log( entity.currPrice);
	                           callback1(null);
	                       });
	                       response.on('error', function(err){
	                           callback1(err);
	                       });
	                   }
	               });
	           }
	           , function(error){

	               if(error){
	               		callback(error);
	               }else{
	               		 retrieveTunePrice(entities,callback);
	               		 // callback(error, entities);
	               }
	               // callback(error, entities);
	           }
	        );
};

function retrieveTunePrice(entities,callback){
	// callback(null, entities);
	var urlTemplate = 'http://money.finance.sina.com.cn/quotes_service/api/xml.php/CN_MarketData.getKLineData?symbol=%s&scale=30&datalen=24';
	var url;

	async.forEach(entities
		, function(entity, callback1){
	        url = util.format(urlTemplate, entity.code);

			http.get(url, function(res) {	 
				 if(res.statusCode == 200){
				  	var resData = '';
						res.on('data', function (chunk) {
					    	resData += chunk;
						});

						res.on('end', function(){
							//util.log('The data retrieve for ' + code + " is finished!");		
							var parser = new xml2js.Parser();
							parser.on('end', function(result) {
								var items = result.item;
								if(items != undefined && items.length == 24){
									var maxVal = jutils.max(items, 'high').high;
									var minVal = jutils.min(items, 'low').low;
									entity.tunePrice = ((maxVal - minVal) * 25 / items[23].close).toFixed(2);

								}else{			
									entity.tunePrice = 0.0;
								}
								callback1(null);
							});
							parser.parseString(resData);									
						});
					}	
			}).on('error', function(err){
				util.log('BuyStockDao: ' + err.message);
				callback1(err);
			});

      	}
      	, function(error){
          	callback(error, entities);
      	}

    );

}


