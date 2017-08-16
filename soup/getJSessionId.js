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
	/*
	Returns session id
	
	Thanks
	https://stackoverflow.com/questions/38812878/getting-sessionid-with-javascript

	*/
	var jsId = document.cookie.match(/JSESSIONID=[^;]+/);
	if(jsId != null) {
		if (jsId instanceof Array)
			jsId = jsId[0].substring(11);
		else
			jsId = jsId.substring(11);
	}
	return jsId;
};
	
});