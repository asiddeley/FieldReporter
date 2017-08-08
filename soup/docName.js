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

var docName=function() {
	//console.log('docName executed...');
	var path=window.location.pathname; //eg c:/documents/folder/file.html
	var name=path.substring(path.lastIndexOf('/')+1); //eg file.html
	name=name.replace(/%20/g," ");
	return name.substring(0,name.lastIndexOf('.'));
};

//console.log("docName loaded");

return docName;

}); //define
