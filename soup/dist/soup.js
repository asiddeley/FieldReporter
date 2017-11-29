var soup={
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
 "ieSplice":  function(list, index, remove, ins){
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
				//add easily identifiable markers to funciton string 
				func= "FUNC000 "+func.toString()+" FUNC999";	
				return encodeURI(func.toString());
			} else {return func; }
		};
		
		var str=JSON.stringify(str, funcReplacer, ' ');
		//get rid of markers 
		str=str.replace(/"FUNC000|FUNC999"/g,"");
		return(decodeURI(str));
	} ,
 "base": "soup/data/",
 "cache": null,
 "Doc":  function(name, valu){
	this.name=(typeof name == 'undefined')?'unnamed':name.toString();
	this.valu=(typeof valu == 'undefined')?'unvalued':valu.toString();
} ,
 "file": "database.txt",
 "filename":  function(name){
	name=(!name)?"database":name;
	var filename=(soup.file)?soup.localPath(soup.base+soup.file):soup.localPath(soup.base+name+'.txt');
	return filename;
} ,
 "mode": "ie",
 "load":  function(dataDoc){
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
} ,
 "save":  function(dataDoc){
	
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
} ,
 "ieCopyFile":  function(dest, source){
	// copyright tiddly-wiki
	this.ieCreatePath(dest);
	try {
		var fso = new ActiveXObject("Scripting.FileSystemObject");
		fso.GetFile(source).Copy(dest);
	} catch(ex) {
		return false;
	}
	return true;
} ,
 "ieCreatePath":  function(path) {
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
	//Thanks to tiddly wiki
	soup.ieCreatePath(filePath);
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
	if (typeof $.cell == 'undefined') {soup.cell_define();}
	selector=(typeof selector =='undefined')?'[soup-cell]':selector
	$(selector).cell(); return soup; 
} ,
 "cell_define":  function cell_define(){
var db=soup;	
$.widget ("soup.cell", {
	
    options: {
		name: 'unnamed',
		text: 'default',
		xtxt: 'default', //existing text
		undo: [],
		idi: 'default',
		idr: 'default',
		idn: 'default'
	},
	
		_create:function() {
		this.options.name=this.element.attr("id");
		this.options.text=this.element.text();
		this.options.idi=this.options.name+'input';
		this.options.idr=this.options.name+'result';
		this.options.idn=this.options.name+'name';
		this.options=$.extend(this.options, db.load(this.options));
		//this.styleRestore();		
		this._on( this.element, {
			dragstop:'stylingStop',
			resizestop:'stylingStop',
			mouseenter:'_highlight', 
			mouseleave:'_highlightoff' ,
			contextmenu:'_contextmenu'
			//click:'_contentEdit'
		});
		this.render();
    },
	

	_contextmenu:function(event) {
		//var c=window.getComputedStyle(this.element[0],null);
		//var c=this.element.data("ui-draggable"); //long running script
		//$("#dialog").dialog('open').html(soup.anything(c));
		//return false;
		//alert('Cell context menu');
		return false; //cancel other context menus
	},
	
	_destroy: function() {
        //this.element.removeClass( "savable" ).text( "" );
    },
	
	_highlight:function(event) {
		//this.element.css('background-color','silver'); 
		this.options.xtxt=$("#" + this.options.idi).val();
		//$("#"+this.options.idn).show();
		$("#"+this.options.idi).show().css({'position':'relative', 'z-index':10000, 'background':'silver'});
		$("#"+this.options.idr).hide();	
	},
	
	_highlightoff:function(event) {
		//this.element.css('background-color','white'); 
		var ntxt=$("#" + this.options.idi).val();
		//text has changed so 
		if( ntxt != this.options.xtxt) {
			//text changed so save
			ntxt=(ntxt=='')?'--':ntxt;
			this.options.undo.push(this.options.xtxt);
			if (this.options.undo.length > 10) {this.options.undo.shift();}
			this.options.text=ntxt;
			$("#"+this.options.idr).text(this._process(ntxt));	
			db.save(this.options);
		}
		//$("#"+this.options.idn).hide();
		$("#"+this.options.idi).hide();
		$("#"+this.options.idr).show();	
	},
	
	
	_process: function( valu ) {
		//check for and evaluate code in cell content
		if (valu.substr(0,1) == '=') {
			try{valu=eval(valu.substr(1));}
			catch(er){valu=er.toString();}
		}
        return valu;
    },
	
	render: function() {		
		//wrap text so it can be saved & edited
		//console.log('cell foreachItem:'+this.element.foreachItem); //undefined
		this.element.html(
			"<p id='"+ this.options.idn + "' style='display:none;' >"+ this.options.name +"</p>"+
			"<textarea id='"+this.options.idi+"' type='text' style='z-index=10001; "+
			"display:none;width:100%;height:auto;'"+
			"onclick='soup.autoHeight(this)' onkeyup='soup.autoHeight(this)' >"+
			this.options.text+
			"</textarea>"+
			"<p id='"+this.options.idr+"' class='cellresult'>"+
			this._process(this.options.text)+
			"</p>"	
		);
		//this._trigger( "refreshed", null, { text: this.options.text } );
    },
	
	result: function(){
		return this._process(this.options.text);
	},
	
    _setOption: function( key, valu ) {
       //if ( key === "valu" ) { valu = this._checkValu( valu );  }
       this._super( key, valu );
	},
	
	_setOptions: function( options ) {
        this._super( options );
    },	
	
	
	styleGet:function(c){
		//return an object with only drag properties from a given object
		return	$.extend( { }, 
			{ 'position': c['position'] },
			{ 'left': c['left'] },
			//{ 'right': c['right'] },
			{ 'top': c['top'] },
			//{ 'bottom': c['bottom'] },
			{ 'height': c['height'] },
			{ 'width': c['width'] }
		);	
	},
	
	styleRestore:function(c){
		this.element.css(this.styleGet(this.options));
	},			
		
	stylingStop:function(event, ui){
		//save position
		var c=window.getComputedStyle(this.element[0],null);
		this.options=$.extend(this.options, this.styleGet(c));
		//console.log (soup.anything(this.options));
		db.save(this.options);
		//return false;
	}
}); //$.widget
} ,
 "foreach":  function(){$('[soup-foreach]').foreach(); return soup;} ,
 "pocket":  function(){
	$('[soup-pocket]').pocket();
	return soup;
} 
}