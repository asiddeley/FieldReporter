/**********************************
S imple
O pen
U tility
P ackage

Andrew Siddeley

19-Apr-2016
01-Aug-2017
********************************/


// Define a Module with Simplified CommonJS Wrapper...
// see http://requirejs.org/docs/api.html#cjsmodule
define(function(require, exports, module){



return function(){
	
	var m$=$("<div></div>");
	
	var b$=$("<span>brightness:</span>");
	var bv$=$("<span>0</span>");	
	var bs$=$("<span>0</span>").slider({min:0, max:100, step:1});
	
	m$.append(b$).append(bv$).append(bs$);
	m$.menu();
	
	return m$;
	
	
};
	
});