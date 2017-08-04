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

var localFileEnum=require('soup/localFileEnum');
var isPic=require('soup/isPic');

var localPicArray=function(name){
	var fe=localFileEnum();
	var r=[];
	for(; !fe.atEnd(); fe.moveNext()){
		if( isPic(fe.item().name)) r.push(fe.item().name);
	}
	return r;
};

console.log("localPicArray loaded");

return localPicArray;

}); //define
