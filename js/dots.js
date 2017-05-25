var winHeight = 400;
var winWidth = 400;
var playerArray = [0,0,0,0,0,0];
var turn = 0;
var nobody = false;
var count = [0,0,0,0,0,0];
var gridSize = 31;
var rowCount = 0;
var columnCount = 0;
var whitelist = [[],[]];
var brownlist = [[],[]];

function startup1(e){
	winWidth = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
	winHeight = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight;
	scaleGrid();
	playerChange("p0");
	playerChange("p1");
}

function addLoadEvent(func) {
  var oldonload = window.onload;
  if (typeof window.onload != 'function') {
    window.onload = func;
  } else {
    window.onload = function() {
      if (oldonload) {
        oldonload();
      }
      func();
    }
  }
}

addLoadEvent(startup1);

window.onresize = function(event) {
	winWidth = Math.max(window.innerWidth, document.documentElement.clientWidth, document.body.clientWidth);
	winHeight = Math.max(window.innerHeight, document.documentElement.clientHeight, document.body.clientHeight);
	scaleGrid();
	resetCount();
};

window.onkeypress=function(){
	var countClass =	document.getElementsByClassName("count");
	for(i=0;i<countClass.length;i++){
		if(countClass[i].style.display == "block"){
			countClass[i].style.display = "none";
		}
		else{
			countClass[i].style.display = "block";
		}
	}
};

function placePiece(id){
	var name = "dot" + turn;
	if(document.getElementById(id+"div").className == "dotEmpty"){
		document.getElementById(id+"div").className = name;
		count[turn]= count[turn]+1;
		document.getElementById("p"+turn+"count").innerHTML = count[turn];
		checkTaken(id);
		checkCapture(id);
		checkLast();
		takeTurn();
	}
}

function checkLast(){
	var gridCount = columnCount*rowCount;
	var pieceCount = 0;
	for(j=0;j<6;j++){
		pieceCount = pieceCount + count[j];
	}
	if(pieceCount>=gridCount){
		var countClass =	document.getElementsByClassName("count");
		for(i=0;i<countClass.length;i++){
			countClass[i].style.display = "block";
		}
	}
}

function checkTaken(id){
	var idString = id.split(",");
	var x = parseInt(idString[0]);
	var y = parseInt(idString[1]);
	var cl = document.getElementById(id+"div").className;
	var clSplit = cl.split("t");
	var clInt = parseInt(clSplit[1]);
	for(g=0; g<6; g++){
		if(g!=clInt){
			whitelist = [[x],[y]];
			var oldLength = 0;
			var newLength = 0;
			var edge = false;
			do{
				oldLength = whitelist[0].length;
				for(k=0; k<oldLength; k++){
					if(checkAdjacent(whitelist[0][k],whitelist[1][k],"dot"+g.toString())==true){
						edge=true;
						break;
					}
				}
				if(edge==true){break;}
				newLength=whitelist[0].length;
			}while(newLength>oldLength);
			if(edge==false){
				document.getElementById(id+"div").className = "dot"+g.toString();
				resetCount();
				return;
			}
		}
	}
}

function checkCapture(id){
	var idString = id.split(",");
	var x = parseInt(idString[0]);
	var y = parseInt(idString[1]);
	blacklist = [[],[]];
	var cl = document.getElementById(id+"div").className;
	checkStart(x,y,cl);
	for(h=0;h<blacklist[0].length;h++){
		whitelist = [[blacklist[0][h]],[blacklist[1][h]]];
		brownlist = [[],[]];
		if(document.getElementById(blacklist[0][h].toString() + "," + blacklist[1][h].toString()+"div").className!="dotEmpty"){
			brownlist = [[blacklist[0][h]],[blacklist[1][h]]];
		}
		var oldLength = 0;
	  	var newLength = 0;
		var edge = false;
	  	do{
			oldLength = whitelist[0].length;
		  	for(k=0; k<oldLength; k++){
				if(checkAdjacent(whitelist[0][k],whitelist[1][k],cl)==true){
					edge=true;
					break;
				}
		  	}
			if(edge==true){break;}
		  	newLength=whitelist[0].length;
	  	}while(newLength>oldLength);
		if(edge==false){
			for(f=0;f<brownlist[0].length;f++){
				var left = brownlist[0][f].toString() + "," + brownlist[1][f].toString();
				document.getElementById(left+"div").className=cl;
				resetCount();
			}
		}
	}
}

function checkStart(x,y,cl){
	if(x>0){
		var xnew = x-1;
		var ynew = y;
		var left = xnew.toString() + "," + ynew.toString();
		if(document.getElementById(left+"div").className!=cl){
			blacklist[0].push(xnew);
			blacklist[1].push(ynew);
		}
	}
	if(x<columnCount-1){
		var xnew = x+1;
		var ynew = y;
		var right = xnew.toString() + "," + ynew.toString();
		if(document.getElementById(right+"div").className!=cl){
			blacklist[0].push(xnew);
			blacklist[1].push(ynew);
		}
	}
	if(y>0){
		var xnew = x;
		var ynew = y-1;
		var top = xnew.toString() + "," + ynew.toString();
		if(document.getElementById(top+"div").className!=cl){
			blacklist[0].push(xnew);
			blacklist[1].push(ynew);
		}
	}
	if(y<rowCount-1){
		var xnew = x;
		var ynew = y+1;
		var bottom = xnew.toString() + "," + ynew.toString();
		if(document.getElementById(bottom+"div").className!=cl){
			blacklist[0].push(xnew);
			blacklist[1].push(ynew);
		}
	}
}

function checkAdjacent(x,y,cl){
	var edge = false;
	var adjacents = [0,0,0,0];
	if(x>0){
		var xnew = x-1;
		var ynew = y;
		var left = xnew.toString() + "," + ynew.toString();
		if(document.getElementById(left+"div").className!=cl){
			if(white(xnew,ynew)==false){
				adjacents[1]=1;
			}
			if(document.getElementById(left+"div").className!="dotEmpty"){
				brown(xnew,ynew);
			}
		}
	}
	else{edge=true;}
	if(x<columnCount-1){
		var xnew = x+1;
		var ynew = y;
		var right = xnew.toString() + "," + ynew.toString();
		if(document.getElementById(right+"div").className!=cl){
			if(white(xnew,ynew)==false){
				adjacents[2]=1;
			}
			if(document.getElementById(right+"div").className!="dotEmpty"){
				brown(xnew,ynew);
			}
		}
	}
	else{edge=true;}
	if(y>0){
		var xnew = x;
		var ynew = y-1;
		var top = xnew.toString() + "," + ynew.toString();
		if(document.getElementById(top+"div").className!=cl){
			if(white(xnew,ynew)==false){
				adjacents[0]=1;
			}
			if(document.getElementById(top+"div").className!="dotEmpty"){
				brown(xnew,ynew);
			}
		}
	}
	else{edge=true;}
	if(y<rowCount-1){
		var xnew = x;
		var ynew = y+1;
		var bottom = xnew.toString() + "," + ynew.toString();
		if(document.getElementById(bottom+"div").className!=cl){
			if(white(xnew,ynew)==false){
				adjacents[3]=1;
			}
			if(document.getElementById(bottom+"div").className!="dotEmpty"){
				brown(xnew,ynew);
			}
		}
	}
	else{edge=true;}
	return edge;
}

function brown(xnew,ynew){
	var brownb = false;
	for(i=0;i<brownlist[0].length;i++){
		if(brownlist[0][i]==xnew && brownlist[1][i]==ynew){
			brownb=true;
		}
	}
	if(brownb==false){
		brownlist[0].push(xnew);
		brownlist[1].push(ynew);
	}
	return brownb;
}

function white(xnew,ynew){
	var whiteb = false;
	for(i=0;i<whitelist[0].length;i++){
		if(whitelist[0][i]==xnew && whitelist[1][i]==ynew){
			whiteb=true;
		}
	}
	if(whiteb==false){
		whitelist[0].push(xnew);
		whitelist[1].push(ynew);
	}
	return whiteb;
}

function takeTurn(){
	document.getElementById("p"+turn).style.transform="scale(1,1)";
	turn = (turn+1)%6;
	var i = 0;
	while(playerArray[turn]==0){
		turn = (turn+1)%6;
		i++;
		if(i>6){
			alert("Add a player");
			nobody = true;
			break;
		}
	}
	document.getElementById("p"+turn).style.transform="scale(1.1,1.1)";
}

function resetCount(){
	count = [0,0,0,0,0,0];
	var tds = document.getElementsByTagName("td");
	var tdCount = 0;
	for(i=0;i<rowCount;i++){
		for(j=0;j<columnCount;j++){
			var tdid = tds[tdCount].id;
			var cl = document.getElementById(tdid+"div").className;
			var piece = cl.split("dot")[1];
			if(piece!="Empty"){
				var turn = parseInt(piece);
				count[turn]=count[turn]+1;
			}
			tdCount++;
		}
	}
	for(i=0;i<6;i++){
		document.getElementById("p"+i+"count").innerHTML = count[i];
	}
}

function playerChange(player){
	var play = document.getElementById(player);
	var playerNumber = parseInt(player.split("p")[1]);
	var inner = play.innerHTML.split("<");
	if(play.innerHTML[0]=="1"){
		var oldColor = play.style.backgroundColor;
		play.style.backgroundColor="#EBEBEB";
		play.innerHTML = oldColor+"<"+inner[1];
		playerArray[playerNumber]=0;
	}
	else{
		play.style.backgroundColor=inner[0];
		play.innerHTML = "1<"+inner[1];
		playerArray[playerNumber]=1;
	}
	if(nobody==true){
		takeTurn();
	}
	if(playerNumber == turn){
		takeTurn();
	}
}

function scaleGrid(){
	var table = document.getElementById("backgroundTable");
	var table2 = document.getElementById("visibleTable");
	var newRows = Math.round(((winHeight-(winWidth*.2)) / gridSize)-1.5);
	var newColumns = Math.round((winWidth*.8) / gridSize);
	rowCount = newRows;
	columnCount = newColumns;
	var currentRows = table.rows.length;
	var currentColumns = table.rows[0].cells.length;
	var newRows2 = newRows-1;
	var newColumns2 = newColumns-1;
	var currentRows2 = table2.rows.length;
	var currentColumns2 = table2.rows[0].cells.length;

	//columns
	if(newColumns>currentColumns){
		//add cells to existing rows
		for(i=0; i<currentRows; i++){
			for(j=currentColumns; j<newColumns; j++){
				var td = table.rows[i].insertCell(-1);
			}
		}
		for(i=0; i<currentRows2; i++){
			for(j=currentColumns2; j<newColumns2; j++){
				table2.rows[i].insertCell(-1);
			}
		}
	}
	else{
		//remove cells from existing rows
		for(i=0; i<currentRows; i++){
			for(j=newColumns; j<currentColumns; j++){
				table.rows[i].deleteCell(-1);
			}
		}
		for(i=0; i<currentRows2; i++){
			for(j=newColumns2; j<currentColumns2; j++){
				table2.rows[i].deleteCell(-1);
			}
		}
	}
	//rows
	if(newRows>currentRows){
		//add new rows to correct length
		for(i=currentRows; i<newRows; i++){
			var rowNow = table.insertRow(-1);
			for(j=0;j<newColumns;j++){
				var td = rowNow.insertCell(-1);
			}
		}
		for(i=currentRows2; i<newRows2; i++){
			var rowNow2 = table2.insertRow(-1);
			for(j=0;j<newColumns2;j++){
				rowNow2.insertCell(-1);
			}
		}
	}
	else{
		//remove rows
		for(i=newRows; i<currentRows; i++){
			table.deleteRow(-1);
		}
		for(i=newRows2; i<currentRows2; i++){
			table2.deleteRow(-1);
		}
	}
	createIds();
}

function createIds(){
	var tdCount = 0;
	var tds = document.getElementsByTagName("td");
	for(i=0;i<rowCount;i++){
		for(j=0;j<columnCount;j++){
			var tdid = tds[tdCount].id = j+","+i;
			tdCount++;
			document.getElementById(tdid).addEventListener("click", function(){
				placePiece(this.id);
			});
			var div = document.createElement("div");
			document.getElementById(tdid).appendChild(div);
			div.className = "dotEmpty";
			div.id = tdid + "div";
		}
	}
}
