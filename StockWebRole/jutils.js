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

