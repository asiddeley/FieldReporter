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

var soup={};
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


return data;

}); //define

