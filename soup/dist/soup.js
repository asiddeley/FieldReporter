{
 "ver": "20160825",
 "pageCount": 0,
 "picItem": "1",
 "rowCount": 0,
 "autoHeight":  function (el) { 
	$(el).css('height', 'auto').css('height', el.scrollHeight + 5);
} ,
 "docName":  function() {
	//console.log('docName executed...');
	var path=window.location.pathname; //eg c:/documents/folder/file.html
	var name=path.substring(path.lastIndexOf('/')+1); //eg file.html
	name=name.replace(/%20/g," ");
	return name.substring(0,name.lastIndexOf('.'));
} ,
 "edit":  function(list, index, remove, ins){
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
} ,
 "isJpg":  function(path){
	var ext=path.substring(path.lastIndexOf('.')+1); 
	if (ext.toUpperCase()=="JPG") return true;
	else return false;
} ,
 "isPic":  function(path){
	var r;
	var ext=path.substring(path.lastIndexOf('.')+1); 
	switch(ext.toUpperCase()){
		case "JPG":	r=true;	break;
		case "PNG":	r=true; break;
		default: r=false;
	}
	return r;
} ,
 "idfix":  function(el, suffix){
	var id=$(el).attr('id');
	$(el).attr('id', id + suffix);
	//console.log(el, id+suffix);
	return soup; //to allow chaining
} ,
 "idfixx":  function(el, prefix, suffix){
	var id=$(el).attr('id');
	$(el).attr('id', prefix + id + suffix);
	//console.log(el, prefix+id+suffix);
	return soup; //to allow chaining
} ,
 "localPath":  function(name){
	var path=window.location.pathname; //eg c:/documents/folder/file.html
	var dir=path.substring(1, path.lastIndexOf('/'))+"/" + name; //eg c:/documents/folder
	var fn = dir.replace(/\//g,"\\\\");
	fn = fn.replace(/%20/g," ");
	return fn;
} ,
 "localPicArray":  function(name){
	var fe=localFileEnum();
	var r=[];
	for(; !fe.atEnd(); fe.moveNext()){
		if( isPic(fe.item().name)) r.push(fe.item().name);
	}
	return r;
} ,
 "localPicItem":  function(){return picItem;} ,
 "result":  function(id){
	//returns the result from soup widget of given id
	//console.log('get returns:'+key);
	return $(id).cell('result')||$(id).pocket('result');
} ,
 "stringifyFunc":  function(str){
		var funcReplacer=function(key, func){	
			if (typeof func == 'function'){ 
				//add easily identifiable wrappers to funciton string 
				func= "FUNC000 "+func.toString()+" FUNC999";	
				return encodeURI(func.toString());
			} else {return func; }
		};
		
		var str=JSON.stringify(str, funcReplacer, ' ');
		//get rid of wrappers  "FUNC000 function(){...} FUNC999" 
		str=str.replace(/"FUNC000|FUNC999"/g,"");
		return(decodeURI(str));
	} ,
 "base": "data/",
 "cache": null,
 "Doc":  function(name, valu){
	this.name=(typeof name == 'undefined')?'unnamed':name.toString();
	this.valu=(typeof valu == 'undefined')?'unvalued':valu.toString();
} ,
 "file": "database.txt",
 "filename":  function(name){
	name=(!name)?"database":name;
	var filename=(db.file)?localPath(db.base+db.file):localPath(db.base+name+'.txt');
	return filename;
} ,
 "mode": "ie",
 "load":  function(dataDoc){
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
} ,
 "save":  function(dataDoc){
	
	if (typeof(dataDoc)=='string') dataDoc=new db.Doc('unnamed', dataDoc);
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
} ,
 "ieLoadFile":  function(filePath){
	// copyright tiddly-wiki
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
} ,
 "ieSaveFile":  function(filePath, content){
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
} ,
 "cell":  function(selector){
	selector=(typeof selector =='undefined')?'[soup-cell]':selector
	$(selector).cell(); return soup; 
} ,
 "foreach":  function(){$('[soup-foreach]').foreach(); return soup;} ,
 "pocket":  function(){
	$('[soup-pocket]').pocket();
	return soup;
} 
}