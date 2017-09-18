/**********************************
S iddeley's
O pen
U tility
P ackage

Andrew Siddeley
17-Sep-2017
********************************/

// Define a Module with Simplified CommonJS Wrapper...
// see http://requirejs.org/docs/api.html#cjsmodule
define(function(require, exports, module){
	
return function(scriptFile){
	//creates a script tag then loads and executes the script
	//scriptFile is relative to the calling html file eg.
	//scriptFile="./soup/private/dbAPI.js";

	var script   = document.createElement("script");
	script.type  = "text/javascript";
	script.src   = "./soup/private/dbAPI.js";    // use this for linked script
	//script.text  = "alert('voila!');"            // use this for inline script
	document.head.appendChild(script); 
};
 
}); //define
