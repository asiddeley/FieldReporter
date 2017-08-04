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

/****************************************
IE file functions
Thanks tiddly-wiki
Returns null if it can't do it, false if there's an error, 
or a string of the content if successful
***************************************/

var ieCopyFile=function(dest, source){
	// copyright tiddly-wiki
	this.ieCreatePath(dest);
	try {
		var fso = new ActiveXObject("Scripting.FileSystemObject");
		fso.GetFile(source).Copy(dest);
	} catch(ex) {
		return false;
	}
	return true;
};

console.log("ieCopyFile loaded");

return ieCopyFile;

}); //define
