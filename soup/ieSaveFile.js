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

var ieCreatePath=require('soup/ieCreatePath');

var ieSaveFile=function(filePath, content){
	// copyright tiddly wiki
	ieCreatePath(filePath);
	try {
		var fso = new ActiveXObject("Scripting.FileSystemObject");
	} catch(ex) {
		return null;
	}
	var file = fso.OpenTextFile(filePath,2,-1,0);
	file.Write(content);
	file.Close();
	return true;
}
///////////////////////////////////////////

return ieSaveFile;

}); //define
