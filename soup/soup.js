/**********************************
S imple
O ff-line
U tility
P ackage

Andrew Siddeley
19-Apr-2016
*/


requirejs.config({
	//default base URL is same as HTML but needs to be the same as jquery for jquery to work
	baseUrl: "jquery",
	//paths below are relative to baseURL
	paths: {
		soup:"../soup"
	}
}); 

// Define a Module with Simplified CommonJS Wrapper...
// see http://requirejs.org/docs/api.html#cjsmodule
define( function(require, exports, module) {

var soup={};
var $=require('jquery');
var $$=require('jquery-ui');


soup.ver="16.06.25";

soup.pageCount=0;
soup.picItem="1";
soup.rowCount=0;

//console.log("loading soup");

//soup.anything=function(input){return this.mayNotBeStr(input);}

soup.anything=function(obj){
	//returns anything as a string, with HTML markups
	var r="";  //$(".sandboxResult"+soup.sandbox.name).val()+"<br>";
	switch(typeof obj){
		case "object":
			r="<u>Object or Array:</u><br>";
			for (var i in obj) {
				//if (obj.hasOwnProperty(i)){
					r+=i +":"+soup.anything(obj[i])+"<br>";
				//}
			}
		break;
		default:
			//r="<u>"+ typeof (obj)+"</u><br>"+obj;
			r=obj;
	}
	return r;
}

soup.anything$=function(obj){
	//returns anything as a string, with escaped markups
	var r="";  
	switch(typeof obj){
		case "object":
			r="Object or Array:\n";
			for (var i in obj) {
					r+=i +" => "+soup.anything(obj[i])+"   ";
			}
		break;
		default:
			//r="<u>"+ typeof (obj)+"</u><br>"+obj;
			r=obj;
	}
	return r;
}


soup.autoHeight=function (el) {
	//Thanks http://stephanwagner.me/auto-resizing-textarea
    $(el).css('height', 'auto').css('height', el.scrollHeight + 5);
}


/*******************************************
Soup ajax database functions
A Siddeley
25-May-2016
********************************************/


soup.axLoadFile=function(col){

	// col = mongo style collection eg. {field1:"val1", field2:{field21:"hello"}...}
	// A Siddeley, 25-May-2016
	
	try {
		//"q" example - return all documents with "active" field of true:
		//https://api.mlab.com/api/1/databases/my-db/collections/my-coll?q={"active": true}&apiKey=myAPIKey
		var db="soupdb";
		var api="get this from mlab";
		return ($.ajax({
			url: "https://api.mlab.com/api/1/databases/"+db+"/collections/"+col+"?apiKey="+api,
			type: "GET",
			contentType: "application/json"
		}));

	} catch(ex) {
		alert ("axLoadFile failed " + ex);
		return null;
	}
}

soup.axSaveFile=function(filePath, content){
	this.ieCreatePath(filePath);
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


/*******************************************
Soup database functions
A Siddeley
1-May-2016
*/

soup.dataBase="base/"; //sub folder for data storage
soup.dataCache=null; //large string
soup.dataDoc=function(name, valu){
	//Returns a basic data object
	return ({
		name:(typeof name == 'undefined')?'unnamed':name.toString(),
		valu:(typeof valu == 'undefined')?'default-Valu':valu.toString()
	});
}

soup.dataFile="database.txt";
soup.dataFilename=function(name){
	name=(!name)?"database":name;
	return (soup.dataFile)?soup.localPath(soup.dataBase+soup.dataFile):soup.localPath(soup.dataBase+name+'.txt');
}
soup.dataMode="ie"; //use iexplorer activeX to store data as a txt file in project subfolder
//soup.dataMode="ax"; //use ajax to store data at mlab.com mongo database service


soup.dataLoad=function(dataDoc){
	//argument may be a dataDoc (or data record), with target id and default data or
	//a	string representing a target cell id of the cell for which data is requested.
	if (typeof(dataDoc)=='string') dataDoc=soup.dataDoc(dataDoc);
	//var fn=soup.localPath(soup.dataBase);
	var fn=soup.dataFilename(dataDoc['name']);
	if (soup.dataCache === null) {
		switch (soup.dataMode){
			case "ax":
				soup.dataCache=soup.axLoadFile(fn);
			break;
			case "ie":
				soup.dataCache=soup.ieLoadFile(fn);
			break;			
			default:
				soup.dataCache=soup.ieLoadFile(fn);
		}
	}
	if (soup.dataCache === null) {
		//file not found so create file
		var db={};
		db[dataDoc.name]=dataDoc;
		soup.dataCache=JSON.stringify(db);
		
		switch (soup.dataMode){
			case "ax":
				soup.axSaveFile(fn, soup.dataCache);
			break;
			case "ie":
				soup.ieSaveFile(fn, soup.dataCache);
			break;			
			default:
				soup.ieSaveFile(fn, soup.dataCache);
		}		
		//soup.ieSaveFile(fn, soup.dataCache);
		
	} else {
		//file found so extract name:value 
		var db=JSON.parse(soup.dataCache);
		if (typeof(db[dataDoc.name])=='undefined'){
			//name:value not found so add
			db[dataDoc.name]=dataDoc;
			soup.dataCache=JSON.stringify(db);
			
			switch (soup.dataMode){
				case "ax":
					soup.axSaveFile(fn, soup.dataCache);
				break;
				
				case "ie":
					soup.ieSaveFile(fn, soup.dataCache);
				break;			
				
				default:
					soup.ieSaveFile(fn, soup.dataCache);
			}			
			//soup.ieSaveFile(fn, soup.dataCache);
		} 
		else { dataDoc=db[dataDoc.name];}
	}
	return dataDoc;
}

soup.dataSave=function(dataDoc){
	
	if (typeof(dataDoc)=='string') dataDoc=soup.dataDoc(dataDoc);
	//Get text file contents which is a JSON of all cells
	//{name1:value1, name2:value2...}
	//var fn=soup.localPath(soup.dataBase);
	var fn=soup.dataFilename(dataDoc['name']);
	if (soup.dataCache === null){
		soup.dataCache=soup.ieLoadFile(fn);
		//soup.dataCache=soup.axLoadFile(fn);
	}
	if (soup.dataCache === null){
		//file not found so create file
		var db={}; 
		db[dataDoc.name]=cellArg;
		soup.dataCache=JSON.stringify(db);
		var r=soup.ieSaveFile(fn, soup.dataCache);
		//var r=soup.axSaveFile(fn, soup.dataCache);		
	} else {
		//file found so change value of name
		var db=JSON.parse(soup.dataCache);
		db[dataDoc.name]=dataDoc;
		soup.dataCache=JSON.stringify(db);
		var r=soup.ieSaveFile(fn, soup.dataCache);
		//var r=soup.axSaveFile(fn, soup.dataCache);
	}
	//return success of ieSaveFile()
	return r; 
}

////////////////////////////////////////////////////////




soup.docName=function() {
	var path=window.location.pathname; //eg c:/documents/folder/file.html
	var name=path.substring(path.lastIndexOf('/')+1); //eg file.html
	name=name.replace(/%20/g," ");
	return name.substring(0,name.lastIndexOf('.'));
}
	


/****************************************
IE file functions
Thanks tiddly-wiki
Returns null if it can't do it, false if there's an error, 
or a string of the content if successful
***************************************/

soup.ieCopyFile=function(dest, source){
	////////////////////////////
	// copyright tiddly-wiki
	this.ieCreatePath(dest);
	try {
		var fso = new ActiveXObject("Scripting.FileSystemObject");
		fso.GetFile(source).Copy(dest);
	} catch(ex) {
		return false;
	}
	return true;
}

soup.ieCreatePath=function(path) {
	////////////////////////////
	// Copyright tiddly-wiki
	try {
		var fso = new ActiveXObject("Scripting.FileSystemObject");
	} catch(ex) {
		return null;
	}

	var pos = path.lastIndexOf("\\");
	if(pos==-1)
		pos = path.lastIndexOf("/");
	if(pos!=-1)
		path = path.substring(0,pos+1);

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

soup.ieLoadFile=function(filePath){
	//////////////////////////
	// Copyright tiddly-wiki
	try {
		var fso = new ActiveXObject("Scripting.FileSystemObject");
		var file = fso.OpenTextFile(filePath, 1);
		var content = file.ReadAll();
		file.Close();
	} catch(ex) {
		//alert ("loadfile failed " + ex);
		return null;
	}
	
	return content;
}


soup.ieSaveFile=function(filePath, content){
	///////////////////////////
	// Copyright tiddly wiki
	this.ieCreatePath(filePath);
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

soup.edit=function(list, index, remove, ins){
	//similar to splice, which seems to be wonky in iexplorer
	if (Array.isArray(list)) {
		if (typeof ins=='undefined') ins=[];
		if (!Array.isArray(ins)) ins=[ins];
		if (typeof index != 'number') return list;
		if (typeof remove != 'number') return list;
		if (index <= 0){
			return(ins.concat(list.slice(remove)));
		} else if(index < list.length){			
			return (list.slice(0,index).concat(ins).concat(list.slice(index+remove)));		
		} else {
			return (list.concat(ins));		
		}
	}
}

	
///////////////////////////////////////////////////////////////
	
soup.isJpg=function(path){
	var ext=path.substring(path.lastIndexOf('.')+1); 
	if (ext.toUpperCase()=="JPG") return true;
	else return false;
}

soup.isPic=function(path){
	var r;
	var ext=path.substring(path.lastIndexOf('.')+1); 
	switch(ext.toUpperCase()){
		case "JPG":	r=true;	break;
		case "PNG":	r=true; break;
		default: r=false;
	}
	return r;
}
	
soup.localFileEnum=function(){
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
}
	
this.localPicArray=function(){
	var fe=soup.localFileEnum();
	var r=[];
	for(; !fe.atEnd(); fe.moveNext()){
		if( soup.isPic(fe.item().name)) r.push(fe.item().name);
	}
	//alert (r);
	return r;
}
	
soup.localPicItem=function(){return picItem;}

soup.localPath=function(name){
	var path=window.location.pathname; //eg c:/documents/folder/file.html
	var dir=path.substring(1, path.lastIndexOf('/'))+"/" + name; //eg c:/documents/folder
	var fn = dir.replace(/\//g,"\\\\");
	fn = fn.replace(/%20/g," ");
	return fn;
}


soup.idfix=function(el, suffix){
	var id=$(el).attr('id');
	$(el).attr('id', id + suffix);
	return soup; //to allow chaining
}

soup.idfixx=function(el, prefix, suffix){
	var id=$(el).attr('id');
	$(el).attr('id', prefix + id + suffix);
	return soup; //to allow chaining
}


soup.result=function(id){
	//returns the result from soup widget of given id
	//console.log('get returns:'+key);
	return $(id).cell('result')||$(id).pocket('result');
}



window.soup=soup;
console.log('soup window.soup --- ',window.soup);
soup.cell=require('soup/cell');
soup.foreach=require('soup/foreach');

console.log('all SOUP modules loaded');


return soup;

}); //define


