/**********************************
S iddeley's
O pen
U tility
P rogram

abstract database 

2-Dec-2017
****************************************/


function ADB(url){
	this.url=url;
	
	
	
}

ADB.prototype.connect=function (){
	
	
	
}


// Define a Module with Simplified CommonJS Wrapper...
// see http://requirejs.org/docs/api.html#cjsmodule
define( function(require, exports, module) {

//db=new Database("table")

var Database=function(dbName, dbFolder){
	//default local folder
	this.base="database/";
	//quick storage
	this.cache="";
	//document or record, eg. {field1:value1, field2:[1,2,3], field4:{},... } 
	this.DataDoc=function(name, valu){
		this.name=(typeof name == 'undefined')?'unnamed':name.toString();
		this.valu=(typeof valu == 'undefined')?'unvalued':valu.toString();
	};
	this.file="database.js";
	this.filename=function(name){
		name=(typeof name != "string" )?"database":name;
		var filename=(this.file)?soup.localPath(this.base+this.file):this.localPath(this.base+name+'.js');
		return filename;
	};
	
	//this.mode="ie"; //use iexplorer activeX to store data as a txt file in project subfolder
	//this.mode="ax"; //use ajax to store data at mlab.com mongo database service
	this.mode="ie"; 
};

Database.prototype.load=function(dataDoc, callback){
	//argument may be a dataDoc object (record) with name:somename and valu:somevalu fields OR
	//a string for the name of the record.
	if (typeof(dataDoc)=='string') {dataDoc=new this.DataDoc(dataDoc);}

	var fn=this.filename(dataDoc['name']);
	
	//cache empty so try to load from file
	if (this.cache === null) {
		switch (this.mode){
			case "ax":this.cache=soup.axLoadFile(fn);break;
			case "ie":this.cache=soup.ieLoadFile(fn);break;			
			default:this.cache=soup.ieLoadFile(fn);
		}
	}
	
	//cache empty means file not found so create it. 
	if (this.cache === null) {
		var collection={}; 
		collection[dataDoc.name]=dataDoc;
		this.cache=JSON.stringify(collection);
		switch (this.mode){
			case "ax":soup.axSaveFile(fn, this.cache);break;
			case "ie":soup.ieSaveFile(fn, this.cache);break;			
			default:soup.ieSaveFile(fn, soup.cache);
		}		
	} 
	// cache not emptt so extract name:
	else {		
		var collection=JSON.parse(this.cache);
		if (typeof(collection[dataDoc.name])=='undefined'){
			//name: not found so add
			collection[dataDoc.name]=dataDoc;
			this.cache=JSON.stringify(collection);
			switch (this.mode){
				case "ax":soup.axSaveFile(fn, this.cache);break;
				case "ie":soup.ieSaveFile(fn, this.cache);break;			
				default:soup.ieSaveFile(fn, soup.cache);}			
			//soup.ieSaveFile(fn, soup.dataCache);
		} 
		else { dataDoc=collection[dataDoc.name];}
	}
	
	if (typeof callback=="function") {callback.call(this, dataDoc);} 
	return dataDoc;
};




var db={};
//database properties & functions

//sub folder for data storage
db.base="soup/data/"; 

//large string
db.cache=null; 

//document factory - data record
db.Doc=function(name, valu){
	this.name=(typeof name == 'undefined')?'unnamed':name.toString();
	this.valu=(typeof valu == 'undefined')?'unvalued':valu.toString();
};

db.file="database.txt";

db.filename=function(name){
	name=(!name)?"database":name;
	var filename=(soup.file)?soup.localPath(soup.base+soup.file):soup.localPath(soup.base+name+'.txt');
	return filename;
};

db.mode="ie"; //use iexplorer activeX to store data as a txt file in project subfolder
//soup.dataMode="ax"; //use ajax to store data at mlab.com mongo database service

db.load=function(dataDoc){
	//argument may be a dataDoc object (or data record), with target id and default data or
	//a string representing a target cell id of the cell for which data is requested.
	if (typeof(dataDoc)=='string') dataDoc=new soup.Doc(dataDoc);
	//var fn=soup.localPath(soup.dataBase);
	var fn=soup.filename(dataDoc['name']);
	if (soup.cache === null) {
		switch (soup.mode){
			case "ax":soup.cache=soup.axLoadFile(fn);break;
			case "ie":soup.cache=soup.ieLoadFile(fn);break;			
			default:soup.cache=soup.ieLoadFile(fn);
		}
	}
	if (soup.cache === null) {
		//file not found so create file
		var dbc={}; //collection
		dbc[dataDoc.name]=dataDoc;
		soup.cache=JSON.stringify(dbc);
		
		switch (soup.mode){
			case "ax":soup.axSaveFile(fn, soup.cache);break;
			case "ie":soup.ieSaveFile(fn, soup.cache);break;			
			default:soup.ieSaveFile(fn, soup.cache);
		}		
		//soup.ieSaveFile(fn, soup.dataCache);
		
	} else {
		//file found so extract name:value 
		var dbc=JSON.parse(soup.cache);
		if (typeof(dbc[dataDoc.name])=='undefined'){
			//name:value not found so add
			dbc[dataDoc.name]=dataDoc;
			soup.cache=JSON.stringify(dbc);
			switch (soup.mode){
				case "ax":soup.axSaveFile(fn, soup.cache);break;
				case "ie":soup.ieSaveFile(fn, soup.cache);break;			
				default:soup.ieSaveFile(fn, soup.cache);}			
			//soup.ieSaveFile(fn, soup.dataCache);
		} 
		else { dataDoc=dbc[dataDoc.name];}
	}
	return dataDoc;
};

db.save=function(dataDoc){
	
	if (typeof(dataDoc)=='string') dataDoc=new soup.Doc('unnamed', dataDoc);
	//Get text file contents which is a JSON of all cells
	//{name1:value1, name2:value2...}
	//var fn=soup.localPath(soup.dataBase);
	var fn=soup.filename(dataDoc.name);
	var r=null; //return value represents success of data load/save
	
	if (soup.cache === null){
		//cache null so load it
		soup.cache=ieLoadFile(fn);
		//soup.dataCache=soup.axLoadFile(fn);
	}
	
	if (soup.cache === null){
		//cache still null means file not found so create file
		var dbc={}; 
		
		dbc[dataDoc.name]=dataDoc; 
		
		soup.cache=JSON.stringify(dbc);
		switch (db.mode){
			case "ax":r=soup.axSaveFile(fn, soup.cache);break;
			case "ie":r=soup.ieSaveFile(fn, soup.cache);break;			
			default:soup.ieSaveFile(fn, soup.cache);
		}
		//var r=ieSaveFile(fn, soup.dataCache);
		//var r=soup.axSaveFile(fn, soup.dataCache);
	} else {
		//file found so update record (change value of item identified by name)
		var dbc=JSON.parse(soup.cache);
		dbc[dataDoc.name]=dataDoc;
		soup.cache=JSON.stringify(dbc);
		switch (soup.mode){
			case "ax":r=soup.axSaveFile(fn, soup.cache);break;
			case "ie":r=soup.ieSaveFile(fn, soup.cache);break;			
			default:r=soup.ieSaveFile(fn, soup.cache);
		}
	}
	//return success of ieSaveFile()
	return r; 
};

//console.log("database loaded");

//return library (object) of soup database functions
return db;

}); //define

