/**********************************
S imple
O ff-line
U tility
P ackage

Andrew Siddeley
19-Apr-2016
*/


/*******************************************
Soup database functions
A Siddeley
1-May-2016
*/

// Define a Module with Simplified CommonJS Wrapper...
// see http://requirejs.org/docs/api.html#cjsmodule
define( function(require, exports, module) {

//require('soup'); //timeout - due to circular reference?
//database part of soup...

//dependencies
var db={};
var localPath=require('soup/localPath');
var axLoadFile=require('soup/axLoadFile');
var axSaveFile=require('soup/axSaveFile');
var ieLoadFile=require('soup/ieLoadFile');
var ieSaveFile=require('soup/ieSaveFile');

//database properties & functions

//sub folder for data storage
db.base="data/"; 

//large string
db.cache=null; 

//document factory - data record
db.Doc=function(name, valu){
	this.name=(typeof name == 'undefined')?'unnamed':name.toString();
	this.valu=(typeof valu == 'undefined')?'unvalued':valu.toString();
}

db.file="database.txt";

db.filename=function(name){
	name=(!name)?"database":name;
	var filename=(db.file)?localPath(db.base+db.file):localPath(db.base+name+'.txt');
	return filename;
}

db.mode="ie"; //use iexplorer activeX to store data as a txt file in project subfolder
//soup.dataMode="ax"; //use ajax to store data at mlab.com mongo database service

db.load=function(dataDoc){
	//argument may be a dataDoc object (or data record), with target id and default data or
	//a string representing a target cell id of the cell for which data is requested.
	if (typeof(dataDoc)=='string') dataDoc=new db.Doc(dataDoc);
	//var fn=soup.localPath(soup.dataBase);
	var fn=db.filename(dataDoc['name']);
	if (db.cache === null) {
		switch (db.mode){
			case "ax":db.cache=axLoadFile(fn);break;
			case "ie":db.cache=ieLoadFile(fn);break;			
			default:db.cache=ieLoadFile(fn);
		}
	}
	if (db.cache === null) {
		//file not found so create file
		var dbc={}; //collection
		dbc[dataDoc.name]=dataDoc;
		db.cache=JSON.stringify(dbc);
		
		switch (db.mode){
			case "ax":axSaveFile(fn, db.cache);break;
			case "ie":ieSaveFile(fn, db.cache);break;			
			default:ieSaveFile(fn, db.cache);
		}		
		//soup.ieSaveFile(fn, soup.dataCache);
		
	} else {
		//file found so extract name:value 
		var dbc=JSON.parse(db.cache);
		if (typeof(dbc[dataDoc.name])=='undefined'){
			//name:value not found so add
			dbc[dataDoc.name]=dataDoc;
			db.cache=JSON.stringify(dbc);
			switch (db.mode){
				case "ax":axSaveFile(fn, db.cache);break;
				case "ie":ieSaveFile(fn, db.cache);break;			
				default:ieSaveFile(fn, db.cache);}			
			//soup.ieSaveFile(fn, soup.dataCache);
		} 
		else { dataDoc=dbc[dataDoc.name];}
	}
	return dataDoc;
}

db.save=function(dataDoc){
	
	if (typeof(dataDoc)=='string') dataDoc=new db.Doc(dataDoc);
	//Get text file contents which is a JSON of all cells
	//{name1:value1, name2:value2...}
	//var fn=soup.localPath(soup.dataBase);
	var fn=db.filename(dataDoc.name);
	var r=null; //return value represents success of data load/save
	
	if (db.cache === null){
		//cache null so load it
		db.cache=ieLoadFile(fn);
		//soup.dataCache=soup.axLoadFile(fn);
	}
	
	if (db.cache === null){
		//cache still nulll means file not found so create file
		var dbc={}; 
		
		//dbc[dataDoc.name]=cellArg; ///cellArg not defined and I forget what it is, guessing is should be as follows
		dbc[dataDoc.name]=dataDoc; 
		
		db.cache=JSON.stringify(dbc);
		switch (db.mode){
			case "ax":r=axSaveFile(fn,db.cache);break;
			case "ie":r=ieSaveFile(fn, db.cache);break;			
			default:ieSaveFile(fn, db.cache);
		}
		//var r=ieSaveFile(fn, soup.dataCache);
		//var r=soup.axSaveFile(fn, soup.dataCache);
	} else {
		//file found so update record (change value of item identified by name)
		var dbc=JSON.parse(db.cache);
		dbc[dataDoc.name]=dataDoc;
		db.cache=JSON.stringify(dbc);
		switch (db.mode){
			case "ax":r=axSaveFile(fn, db.cache);break;
			case "ie":r=ieSaveFile(fn, db.cache);break;			
			default:r=ieSaveFile(fn, db.cache);
		}
	}
	//return success of ieSaveFile()
	return r; 
};

console.log("database loaded");

//return library (object) of soup database functions
return db;

}); //define

