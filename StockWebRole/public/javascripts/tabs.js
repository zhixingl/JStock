window.onload=function() {

  // get tab container
  	var container = document.getElementById("tabContainer");
    var tabcon = document.getElementById("tabscontent");
		//alert(tabcon.childNodes.item(1));
    // set current tab
    var navitem = document.getElementById("tabHeader_1");
		
    //store which tab we are on
    var ident = navitem.id.split("_")[1];
	//alert(ident);
    navitem.parentNode.setAttribute("data-current",ident);
    //set current tab with class of activetabheader
    navitem.setAttribute("class","tabActiveHeader");

    //hide two tab contents we don't need
   	var pages = tabcon.getElementsByTagName("div");
    for (var i = 0; i < pages.length; i++) {
     	 pages.item(i).style.display="none";
    };

    //this adds click event to tabs
    var tabs = container.getElementsByTagName("li");
    for (i = 0; i < tabs.length; i++) {
      tabs[i].onclick=displayPage;
    }

    var evt = document.createEvent("MouseEvents");
    evt.initMouseEvent('click',true, true, window, 1, 0, 0, 0, 0,
        false, false, false, false, 0, null);

    tabs[0].dispatchEvent(evt);



}

var myTimeInterval = 0;
var xhr;
// on click of one of tabs
function displayPage() {
    var current = this.parentNode.getAttribute("data-current");
    //remove class of activetabheader and hide old contents
    document.getElementById("tabHeader_" + current).removeAttribute("class");
    document.getElementById("tabpage_" + current).style.display="none";

    var ident = this.id.split("_")[1];
    //add class of activetabheader to new active tab and show contents
    this.setAttribute("class","tabActiveHeader");
    document.getElementById("tabpage_" + ident).style.display="inline";
    this.parentNode.setAttribute("data-current",ident);

    var functions = [retrieveBoughtData, retrieveSoldData1, retrieveSoldData2];
    var i = parseInt(ident) - 1;
    if(myTimeInterval){
        clearInterval(myTimeInterval);
    }

    if(xhr){
        try{xhr.abort();}catch(e){}
    }

    functions[i].call();

    myTimeInterval = setInterval(functions[i], 60000);
    if('hidden' in document){//HTML5 supported
        document.addEventListener('visibilitychange', function(){
            if(document.hidden){
                clearInterval(myTimeInterval);
            }else{
                myTimeInterval = setInterval(functions[i], 60000);
            }        
        });
    }

}

var loader = document.getElementById("ajaxloader1");
function retrieveBoughtData(){
    var tblBought = document.getElementById("tblBought");
    
    xhr = new XMLHttpRequest();

    
    xhr.open("GET", "./retrieveBought", true);
   // xhr.responseType = "json";
    xhr.onreadystatechange = function () {
      if (xhr.readyState == 4 ) {
        
        if(xhr.status != 200){
            console.log('some error happens ' + xhr.status);
            return;
        }
        var jsonData = xhr.response;
        if(jsonData == undefined){
            jsonData = xhr.responseText;
        }
        var jsonArray = JSON.parse(jsonData);
        
        var content = "";
        var item;
        var row;
        var cell;
        
        //tBody.innerHTML = "";
        // clearTbody(tBody);
        var tBody = tblBought.tBodies[0];
        if(jsonArray.length > 0){
            clearTbody(tBody);
        }

        var codeArray = new Array();

        for(var i = 0; i < jsonArray.length; i ++){

            item = jsonArray[i];
           // content += "<tr>";
            row =  tBody.insertRow(-1);
            row.id = "b_" + item.code;
            codeArray.push({code:item.code, buyPrice:item.buyPrice});
            
/*            content = "";
            content += "<td class='stockcode'>" 
                        + item.code 
                        + "</td>";
            content += "<td>" + item.name + "</td>";
            content += "<td title='" + new Date(parseInt(item.buyDate)).toLocaleString() + "''>" 
                    + new Date(parseInt(item.buyDate)).format('mm/dd/yyyy') + "</td>";
            content += "<td>" + new Date(parseInt(item.buyDate)).format('HH:MM:ss') + "</td>";
            content += "<td>" + item.buyPrice + "</td>";
            content += "<td>" + item.buyVolume + "</td>";
            content += "<td>" + item.currPrice + "</td>";
            content += "<td>" + ((item.currPrice - item.buyPrice) * 100 / item.buyPrice).toFixed(2) + "%</td>";
            
            row.innerHTML = content;
            */

            //Javascript code to insert the table contents
            cell = row.insertCell(-1);
            cell.setAttribute("class", "stockcode");
            cell.innerText = item.code;

            row.insertCell(-1).innerText = item.code;

            cell = row.insertCell(-1);
            cell.setAttribute("title", new Date(parseInt(item.buyDate)).toLocaleString());
            cell.innerText = new Date(parseInt(item.buyDate)).format('mm/dd/yyyy');

            row.insertCell(-1).innerText = new Date(parseInt(item.buyDate)).format('HH:MM:ss');            

            row.insertCell(-1).innerText = item.buyPrice;
            row.insertCell(-1).innerText = item.buyVolume;
            row.insertCell(-1).innerText = item.tunePrice;
            row.style.background = "#ff9999";

/*            row.insertCell(-1).innerText = item.currPrice;
            row.insertCell(-1).innerText = item.tunePrice;
            var profit = ((item.currPrice - item.buyPrice) * 100 / item.buyPrice - 0.3).toFixed(2);
            row.insertCell(-1).innerText = profit + "%";

            if(profit > 0){
                row.style.background = "#ff9999";
            }else{
                row.style.background = "#99FF99";
            }
            */
            //Javascript code to insert the table contents - finish

            row.firstChild.setAttribute("code", item.code);
            if(row.firstChild.addEventListener){
                row.firstChild.addEventListener("click", function(){
                    var url = "http://finance.sina.com.cn/realstock/company/"
                            + this.getAttribute("code")
                            + "/nc.shtml";
                    window.open(url);
                })
            }else if(row.firstChild.attachEvent){
                row.firstChild.attachEvent("onclick", function(){
                    var myCode = this.event.srcElement.getAttribute("code");
                    var url = "http://finance.sina.com.cn/realstock/company/"
                            + myCode
                            + "/nc.shtml";
                    window.open(url);
                })
            }
            //content +="</tr>\n";
        }

//        alert(JSON.stringify(codeArray));
        if(codeArray.length > 0){
            retrieveExtraBuyData(tBody, codeArray);
        }

        
      }
    }
    xhr.setRequestHeader("Cache-Control", "no-cache");
    xhr.send();
    loader.style.display = "block";
    
}

function retrieveExtraBuyData(tBody, codeArray){
    var xhr1 = new XMLHttpRequest();
    
    xhr1.open("POST", "/retrieveExtraBuyData");
    xhr1.setRequestHeader('Content-Type', 'application/json');
    xhr1.setRequestHeader("Cache-Control", "no-cache");
    xhr1.onreadystatechange = function () {
        if (xhr1.readyState == 4){
            loader.style.display = "none"; 
            if (xhr1.status != 200) {
                console.error('wrong status code: ' + xhr1.status);
            }
            var jsonData = xhr1.response;
            if(jsonData == undefined){
                jsonData = xhr1.responseText;
            }
            var jsonArray = JSON.parse(jsonData);
            var rows = tBody.rows;
            var item;
            var row;
            for(var i = 0; i < jsonArray.length; i ++){
                item = jsonArray[i];
                row = rows[i];
                row.insertCell(-1).innerText = item.currPrice;
                var profit = ((item.currPrice - item.buyPrice) * 100 / item.buyPrice - 0.3).toFixed(2);
                row.insertCell(-1).innerText = profit + "%";

                if(profit > 0){
                    row.style.background = "#ff9999";
                }else{
                    row.style.background = "#99FF99";
                }
                
            }

        }
    }
    xhr1.send(JSON.stringify(codeArray));
    // xhr.timeout=60000;
}

function retrieveSoldData1(){
    var tblSold1 = document.getElementById("tblSold1");
    var loader = document.getElementById("ajaxloader1");

    xhr = new XMLHttpRequest();
    xhr.open("GET", "./retrieveSold1", true);
   // xhr.responseType = "json";
    xhr.onreadystatechange = function () {
      if (xhr.readyState == 4 && xhr.status == 200) {
        var jsonData = xhr.response;
        if(jsonData == undefined){
            jsonData = xhr.responseText;
        }
        var jsonArray = JSON.parse(jsonData);
        
        var content = "";
        var item;
        var row, cell;
       
        //tBody.innerHTML = "";

        var tBody = tblSold1.tBodies[0];
        if(jsonArray.length > 0){
            clearTbody(tBody);
        }
        for(var i = 0; i < jsonArray.length; i ++){
        //var content = "<tr><td>sh600000</td><td>浦发银行</td><td>2012/07/31</td><td>6.78</td><td>1000</td><td>6.89</td><td>3.0%</td></tr>";
        //content += content;
            item = jsonArray[i];
           // content += "<tr>";
            row =  tBody.insertRow(-1);
            // row.id = item


            cell = row.insertCell(-1);
            cell.setAttribute("class", "stockcode");
            cell.innerText = item.code;

            row.insertCell(-1).innerText = item.name;

            cell = row.insertCell(-1);
            cell.setAttribute("title", new Date(parseInt(item.buyDate)).toLocaleString());
            cell.innerText = new Date(parseInt(item.buyDate)).format('mm/dd/yyyy');
            row.insertCell(-1).innerText = new Date(parseInt(item.buyDate)).format('HH:MM:ss');            

            row.insertCell(-1).innerText = item.buyPrice;
            row.insertCell(-1).innerText = item.buyVolume;

            cell = row.insertCell(-1);
            cell.setAttribute("title", new Date(parseInt(item.sellDate)).toLocaleString());
            cell.innerText = new Date(parseInt(item.sellDate)).format('mm/dd/yyyy');
            row.insertCell(-1).innerText = new Date(parseInt(item.sellDate)).format('HH:MM:ss');  

            row.insertCell(-1).innerText = item.sellPrice;
            row.insertCell(-1).innerText = item.sellVolume ;

            row.insertCell(-1).innerText = item.currPrice;
            
            var profit = ((item.sellPrice - item.buyPrice) * 100 / item.buyPrice - 0.3).toFixed(2);
            row.insertCell(-1).innerText = profit + "%";
            if(profit > 0){
                row.style.background = "#ff9999";
            }else{
                row.style.background = "#99FF99";
            }

            row.firstChild.setAttribute("code", item.code);

            row.firstChild.addEventListener("click", function(){
                var url = "http://finance.sina.com.cn/realstock/company/"
                        + this.getAttribute("code")
                        + "/nc.shtml";
                window.open(url);
            })
            //content +="</tr>\n";
        }

      loader.style.display = "none"; 
      }
    }
    xhr.setRequestHeader("Cache-Control", "no-cache");
    xhr.send();
    loader.style.display = "block";

}


function retrieveSoldData2(){
    var tblSold2 = document.getElementById("tblSold2");
    var loader = document.getElementById("ajaxloader1");
    var tBody = tblSold2.tBodies[0];

    xhr = new XMLHttpRequest();
    xhr.open("GET", "./retrieveSold2", true);
   // xhr.responseType = "json";
    xhr.onreadystatechange = function () {
      if (xhr.readyState == 4 && xhr.status == 200) {
        var jsonData = xhr.response;
        if(jsonData == undefined){
            jsonData = xhr.responseText;
        }
        var jsonArray = JSON.parse(jsonData);
        
        var content = "";
        var item;
        var row;
        
        //tBody.innerHTML = "";
        var tBody = tblSold2.tBodies[0];
        if(jsonArray.length > 0){
            clearTbody(tBody);
        }
        for(var i = 0; i < jsonArray.length; i ++){
        //var content = "<tr><td>sh600000</td><td>浦发银行</td><td>2012/07/31</td><td>6.78</td><td>1000</td><td>6.89</td><td>3.0%</td></tr>";
        //content += content;
            item = jsonArray[i];
           // content += "<tr>";
            row =  tBody.insertRow(-1);

            cell = row.insertCell(-1);
            cell.setAttribute("class", "stockcode");
            cell.innerText = item.code;

            row.insertCell(-1).innerText = item.name;

            cell = row.insertCell(-1);
            cell.setAttribute("title", new Date(parseInt(item.buyDate)).toLocaleString());
            cell.innerText = new Date(parseInt(item.buyDate)).format('mm/dd/yyyy');
            row.insertCell(-1).innerText = new Date(parseInt(item.buyDate)).format('HH:MM:ss');            

            row.insertCell(-1).innerText = item.buyPrice;
            row.insertCell(-1).innerText = item.buyVolume;

            cell = row.insertCell(-1);
            cell.setAttribute("title", new Date(parseInt(item.sellDate)).toLocaleString());
            cell.innerText = new Date(parseInt(item.sellDate)).format('mm/dd/yyyy');
            row.insertCell(-1).innerText = new Date(parseInt(item.sellDate)).format('HH:MM:ss');  

            row.insertCell(-1).innerText = item.sellPrice;
            row.insertCell(-1).innerText = item.sellVolume ;

            row.insertCell(-1).innerText = item.currPrice;
            // row.insertCell(-1).innerText = ((item.sellPrice - item.buyPrice) * 100 / item.buyPrice - 0.3).toFixed(2) + "%";

            var profit = ((item.sellPriceAvg - item.buyPrice) * 100 / item.buyPrice - 0.3).toFixed(2);
            row.insertCell(-1).innerText = profit + "%";
            if(profit > 0){
                row.style.background = "#ff9999";
            }else{
                row.style.background = "#99FF99";
            }


            row.firstChild.setAttribute("code", item.code);

            row.firstChild.addEventListener("click", function(){
                var url = "http://finance.sina.com.cn/realstock/company/"
                        + this.getAttribute("code")
                        + "/nc.shtml";
                window.open(url);
            })
            //content +="</tr>\n";
        }

      loader.style.display = "none"; 
      }
    }
    xhr.setRequestHeader("Cache-Control", "no-cache");
    xhr.send();
    loader.style.display = "block";
}

function clearTbody(tBody){
    try{
        tBody.innerHTML = "";
    }catch(e){
        if(tBody.rows){
            for(var i = 0; i < tBody.rows.length; i ++){
                tBody.deleteRow(i);
            }
        }
    }
}