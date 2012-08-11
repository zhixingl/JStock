// jutils.js


/**
* Check if the time is still in trading time, 9:30-15:00 GMT+8
* @param{Date} date
* @return{bool}
*/
module.exports.isInTradeTime =  function(date){
	var day = date.getUTCDay();
	var hour = date.getUTCHours();
	var minute = date.getUTCMinutes();
	var second = date.getUTCSeconds();
	
	if(day >= 1 && day <= 5){//from Monday to Friday
		if(hour == 1){			//if it's in 9AM-10AM
			if(minute >= 25){	// >= 9:25
				return true;
			}
		}
		
		if(hour >= 2 && hour < 7){ //from 10AM to 15PM
			return true;
		}

		if(hour == 7){	//If it's 15PM
			if(minute <= 5){	//less than 15:05pm
				return true;
			}
		}
	}
	return false;
};

/**
* Just compare the two days, and return int value
*
*/
module.exports.compareDays = compareDays;

module.exports.isStockClosed = function(closeDate){
	var reduction = compareDays(closeDate, new Date());
	var needPrompt = true;
	if(reduction == 0){
		needPrompt = false;
	}else if(reduction == -1){//yesterday's number
		if(closeDate.getUTCHours() == 7){
			needPrompt = false;
		}
	}
	
	return needPrompt;
	// return false;
};

module.exports.sortEntities = function(entities){
    if(entities == undefined)
      return;
    var length = entities.length;
    var currEntity = null;
    var nextEntity = null;
    var tempEntity = null;

    for(var i = 0; i < length ; i ++){
      for(var j = i + 1; j < length; j++){
        currEntity = entities[i];
        nextEntity = entities[j];
        if(currEntity.buyDate > nextEntity.buyDate){
          //console.log('start swap!')
          tempEntity = currEntity;
          entities[i] = nextEntity
          entities[j] = tempEntity;
        }
      }
    }
};


module.exports.max = function(array, propName){
	var length = array.length;
	var result = Number.MIN_VALUE;
	var i;
	if(typeof(array[0]) == "number"){
		for(i = 0; i < length; i ++){
			if(array[i] > result)
				result = array[i];
		}
		return result;
	}else{
		var resultObj = null;
		var resultCount = 0;
		for(i = 0; i < length; i ++){
			if(array[i][propName] > result){
				resultCount = i;
				result = array[i][propName];
			}
		}

		return array[resultCount];

	}

};

module.exports.min = function(array, propName){
	var length = array.length;
	var result = Number.MAX_VALUE;
	var i;
	if(typeof(array[0]) == "number"){
		for(i = 0; i < length; i ++){
			if(array[i] < result)
				result = array[i];
		}
		return result;
	}else{
		var resultObj = null;
		var resultCount = 0;
		for(i = 0; i < length; i ++){
			if(array[i][propName] < result){
				resultCount = i;
				result = array[i][propName];
			}
		}

		return array[resultCount];

	}

};

function compareDays(day1, day2){
	var d1 = new Date(day1.getFullYear(), day1.getMonth(), day1.getDate());
	var d2 = new Date(day2.getFullYear(), day2.getMonth(), day2.getDate());

	return (d1 - d2)/(1000*60*60*24);
}