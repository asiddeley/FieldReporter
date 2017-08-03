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

var ieCreatePath=function(path) {
	// copyright tiddly-wiki
	try {	var fso = new ActiveXObject("Scripting.FileSystemObject");	} 
	catch(ex) {	return null; }

	var pos = path.lastIndexOf("\\");
	if(pos==-1) pos = path.lastIndexOf("/");
	if(pos!=-1) path = path.substring(0,pos+1);

	var scan = [path];
	var parent = fso.GetParentFolderName(path);
	while(parent && !fso.FolderExists(parent)) {
		scan.push(parent);
		parent = fso.GetParentFolderName(parent);
	}

	for(var i=scan.length-1;i>=0;i--) {
		if(!fso.FolderExists(scan[i])) {
			fso.CreateFolder(scan[i]);
		}
	}
	return true;
}


return ieCreatePath;

}); //define
