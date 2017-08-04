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

var localFileEnum=function(){
	/**********
	Returns an enumetration of local files 
	that is, files in same folder as the subject html file
	Works in IExplorer only
	ASiddeley 26-Sep-2015
	**********/
	var fso = new ActiveXObject("Scripting.FileSystemObject");
	var path=window.location.pathname; //eg c:/documents/folder/file.html
	var name=path.substring(path.lastIndexOf('/')+1); //eg file.html
	var dir=path.substring(1, path.lastIndexOf('/')); //eg c:/documents/folder
	//For line below, thanks http://bucarotechelp.com/design/jseasy/88012801.asp
	var spec = dir.replace(/\//g,"\\\\");
	spec = spec.replace(/%20/g," ");
	//alert(spec);
	var fo = fso.GetFolder(spec);
	var fe = new Enumerator(fo.files);
	return fe;
};

console.log("localFileEnum loaded");

return localFileEnum;

}); //define
