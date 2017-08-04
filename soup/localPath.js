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

var localPath=function(name){
	var path=window.location.pathname; //eg c:/documents/folder/file.html
	var dir=path.substring(1, path.lastIndexOf('/'))+"/" + name; //eg c:/documents/folder
	var fn = dir.replace(/\//g,"\\\\");
	fn = fn.replace(/%20/g," ");
	return fn;
};

console.log("localPath");

return localPath;

}); //define
