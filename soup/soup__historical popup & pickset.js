/**********************************
S imple
O ff-line
U tility
P ackage

Andrew Siddeley
19-Apr-2016
*/

var soup={};

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


/*****************************************
jQuery plugins


Andrew Siddeley
5-June-2016
****************************************/


///////////////////////////////////////////////////////
// CELL
// Made with jQuery widget plug-in
// $('.cell').savable();

soup.cell=function(el){
	/**********
	Turns the provided element into a cell, I.e. savable and editable
	A cell has normally hidden heading and input fields as well as a normally showing result field.
	Cell text can be edited when the mouse is over it,
	*********/
	$(el).cell();
	return soup;
};


$(document).ready(function(){ $(".cell").cell();});

$.widget ("soup.cell", {
	
    options: {
		name: 'unnamed',
		text: 'default',
		xtxt: 'default',
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
		this.options=$.extend(this.options, soup.dataLoad(this.options));
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
		alert('Cell context menu');
		return false; //cancel other context menus
	},
	
	_destroy: function() {
        //this.element.removeClass( "savable" ).text( "" );
    },
	
	_highlight:function(event) {
		//this.element.css('background-color','silver'); 
		this.options.xtxt=$("#" + this.options.idi).val();
		//$("#"+this.options.idn).show();
		$("#"+this.options.idi).show();
		$("#"+this.options.idr).hide();	
	},
	
	_highlightoff:function(event) {
		//this.element.css('background-color','white'); 
		var ntxt=$("#" + this.options.idi).val();
		if( ntxt != this.options.xtxt) {
			//text changed so save
			ntxt=(ntxt=='')?'--':ntxt;
			this.options.undo.push(this.options.xtxt);
			if (this.options.undo.length > 10) {this.options.undo.shift();}
			this.options.text=ntxt;
			$("#"+this.options.idr).text(this._process(ntxt));	
			soup.dataSave(this.options);
		}
		//$("#"+this.options.idn).hide();
		$("#"+this.options.idi).hide();
		$("#"+this.options.idr).show();	
	},
	
	
	_process: function( valu ) {
        return valu;
    },
	
	render: function() {		
		//wrap text so it can be saved & edited
		this.element.html(
			"<p id='"+ this.options.idn + "' style='display:none;' >"+ this.options.name +"</p>"+
			"<textarea id='"+this.options.idi+"' type='text' style='display:none;width:100%;height:auto;'"+
			"onclick='soup.autoHeight(this)' onkeyup='soup.autoHeight(this)' >"+
			this.options.text+
			"</textarea>"+
			"<p id='"+this.options.idr+"' >"+
			this._process(this.options.text)+
			"</p>"	
		);
		//this._trigger( "refreshed", null, { text: this.options.text } );
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
		soup.dataSave(this.options);
		//return false;
	}

});



///////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// foreach widget 

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



$(document).ready(function(){ $(".soup-foreach").foreach(); });

$.widget("soup.foreach", {
	
	/******
	<div class='soup-foreach' soup-foreach='["a", "b", "c"]'>
	<p soup-action='$(this.child).text(this.index)'>element(s) to be repeated</p>
	</div>
	//index:	exposes current loop count, eg: 0 then 1 then 2
	//item:		exposes current loop argumentm eg: "a" then "b" then "c"
	//child:	exposes last new element eg: '<p>element(s) to be repeated</p>' then '<p>element(s) to be...
	***/
	index: 0, 
	item:'default', 
	child: null, 
	
	
	options: {
        name: "unnamed",
		items: '[1, 2, 3]',
		html: "default content",
		ctrl: "<div class='soup-ctrl' style='width:100%; height:1px; display:inline;'></div>"
    },
	
	_create: function() {
		//read defaults from html tag/content
		//apply defaults only if not found in database
		this.options.name=this.element.attr("id");
		this.options.html=this.element.html();
		this.options.items=this.element.attr("soup-foreach");
		//event handlers
		//this._on( this.element, {contextmenu:'_contextmenu',});
		this.refresh();
    },
	
	_contextmenu:function(event) {
		alert('foreach context menu');
		return false;
	},
	
	_destroy: function() {
        //this.element.removeClass( "savable" ).text( "" );
    },
	
    _setOption: function( key, valu ) {
       //if ( key === "valu" ) { valu = this._checkValu( valu );  }
       this._super( key, valu );
	},
	
	_setOptions: function( options ) {
        this._super( options );
        this.refresh();
    },

    refresh: function() {
		//console.log(this.options.html);
		var items=eval(this.options.items);
		var h="", i, j, l=-1, s;

		this.element.html('');
		for (i in items){
			//console.log( this.index + ":" + this.item );
			this.index=i;
			this.item=items[i];
			this.element.append(this.options.html);
			s=$(this.element).find('[soup-action]');
			//console.log("Number of new elements " + s.length);
			//Check and eval soup-action on only the last batch of new elements
			if (l == -1) l=s.length; 
			for (j=l;  j>0;  j--){
				this.child=s[ s.length-j ];
				try { eval( $(this.child).attr('soup-action') ); }
				catch(er) { console.log( er.toString() );}
			}
			//this.element.append('<div onload="console.log(99);">forectrl</div>');
			//this._trigger("fore", null, {index:i, arg:args[i]} );
		}
   },


}); //end of $.widget()


soup.popup=function(el, elpopup){
	//console.log('soup.popup');
	$(el).popup({'elpopup': elpopup}); 
	return soup;
};

$.widget("soup.popup", {
	
	options:{
		
	},
	
	_create:function(){
		console.log('menu added '+this.options.elpopup +'\n');
		
		this._on( this.element, {	
			contextmenu:'_contextmenu',
		});
	},
	
	_contextmenu:function(){
		$(this.options.elpopup).dialog("open");
		return false;
	},
		
	_setOption: function( key, valu ) {
       this._super( key, valu );
	},
	
	_setOptions: function( options ) {
        this._super( options );
    }
	
});






/////////////////////////////////////////////
// pickset


$(document).ready(function(){$(".soup-pickset").pickset(); });
$.widget("soup.pickset", {
	
	/******
	<div class='soup-pickset' soup-pickset='{name:", "b", "c"}'>
	</div>
	//index:	exposes current loop count, eg: 0 then 1 then 2
	//item:		exposes current loop argumentm eg: "a" then "b" then "c"
	//child:	exposes last new element eg: '<p>element(s) to be repeated</p>' then '<p>element(s) to be...
	***/
	index: 0, 
	item:'default', 
	child: null, 
	
	
	options: {
        name: "unnamed",
		items: '[1, 2, 3]',
		html: "content",
    },
	
	_create: function() {
		//read defaults from html tag/content
		//apply defaults only if not found in database
		this.options.name=this.element.attr("id");
		this.options.html=this.element.html();
		this.options.items=this.element.attr("soup-foreach");
		//event handlers
		this._on( this.element, {	
			contextmenu:'_contextmenu'
		});
		this.refresh();
    },
	
	_contextmenu:function(event) {
		alert('Context menu');
		return false;
	},
	
	_destroy: function() {
        //this.element.removeClass( "savable" ).text( "" );
    },
	
    _setOption: function( key, valu ) {
       //if ( key === "valu" ) { valu = this._checkValu( valu );  }
       this._super( key, valu );
	},
	
	_setOptions: function( options ) {
        this._super( options );
        this.refresh();
    },

    refresh: function() {
		//console.log(this.options.html);
		var items=eval(this.options.items);
		var h="", i, j, s;
		var c=-1;
		this.element.html('');
		for (i in items){
			//console.log( this.index + ":" + this.item );
			this.index=i;
			this.item=items[i];
			this.element.append(this.options.html);
			//need to act on last new multiple elements added (not just last new single)
			s=$(this.element).find('[soup-action]');
			console.log("Num elements "+s.length);
			if (c==-1) {c=s.length; console.log("num new elements "+c);}//first loop only
			for (j=0; j<c; j++){
				console.log("j:"+j);
				this.child=s[s.length-c+j];
				try { eval( this.child.attr('soup-action') ); }
				catch(er) { console.log( er );}
			}
			//this._trigger("fore", null, {index:i, arg:args[i]} );
		}
   },


}); //end of $.widget()












console.log('SOUP.js loaded\n');




