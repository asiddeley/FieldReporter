/**********************************
S imple
O pen
U tility
P ackage

Andrew Siddeley

19-Apr-2016
03-Aug-2017
********************************/

// Define a Module with Simplified CommonJS Wrapper...
// see http://requirejs.org/docs/api.html#cjsmodule
define(function(require, exports, module){

var isPic=function(path){
	var r;
	var ext=path.substring(path.lastIndexOf('.')+1); 
	switch(ext.toUpperCase()){
		case "JPG":	r=true;	break;
		case "PNG":	r=true; break;
		default: r=false;
	}
	return r;
};

return isPic;

}); //define
