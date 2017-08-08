/**********************************
S imple
O pen
U tility
P ackage

Andrew Siddeley

19-Apr-2016
06-Aug-2017
********************************/

// Define a Module with Simplified CommonJS Wrapper...
// see http://requirejs.org/docs/api.html#cjsmodule
define(function(require, exports, module){


var anything=function(obj){
	//returns anything as a string, with HTML markups
	var r="";  //$(".sandboxResult"+soup.sandbox.name).val()+"<br>";
	switch(typeof obj){
		case "object":
			r="<u>Object or Array:</u><br>";
			for (var i in obj) {
				//if (obj.hasOwnProperty(i)){
					r+=i +":"+soup.anything(obj[i])+"<br>";
				//}
			}
		break;
		default:
			//r="<u>"+ typeof (obj)+"</u><br>"+obj;
			r=obj;
	}
	return r;
}

var anything$=function(obj){
	//returns anything as a string, with escaped markups
	var r="";  
	switch(typeof obj){
		case "object":
			r="Object or Array:\n";
			for (var i in obj) {
					r+=i +" => "+soup.anything(obj[i])+"   ";
			}
		break;
		default:
			//r="<u>"+ typeof (obj)+"</u><br>"+obj;
			r=obj;
	}
	return r;
}

console.log("anything loaded.  DEPRECATED.");

return {'anything':anything, 'anything$':anything$};

}); //define
