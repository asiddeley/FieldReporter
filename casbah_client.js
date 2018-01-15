/**********************************

Contract
Admin
Site 
Bucause
Architectural
Heros

Andrew Siddeley

13-Dec-2017
********************************/

function array_diff(a, b) {
	//Thanks to https://radu.cotescu.com/javascript-diff-function/
	//saftey first
	if (typeof a=="undefined"){a=[];}
	if (typeof b=="undefined"){b=[];}
	if (a.length < b.length) {var t=a; a=b; b=t;}
	
	//diffArray
	var seen = []
	var diff = [];
	for ( var i = 0; i < b.length; i++) { seen[b[i]] = true; }
	for ( var i = 0; i < a.length; i++) { if (!seen[a[i]]) { diff.push(a[i]);}}
	return diff;
};

function array_insert_after(list, item, neighbour){
	//copy rows array before modifying it
	//var orig=[]; for (var i in list){orig[i]=list[i];}

	var pos=list.indexOf(neighbour);
	if (pos == -1){	list.push(item);}
	else {list.splice(pos+1, 0, item);}
	
	//console.log("array_add_at list, item, neighbour, position:", JSON.stringify(list), item, neighbour, pos);	
	
	return list;
};
//shortform
function aria(list, item, neighbour){ this.array_insert_at(list,item,neighbour);};


function array_movedown(rowids, rowid){
	/**
	Moves rowid down one spot in the array
	@param array of rowids or items
	@param rowid to move down array
	**/
	for (var i=0; i<rowids.length-1; i++){
		if (rowids[i]==rowid){
			var temp=rowids[i+1];rowids[i+1]=rowid;rowids[i]=temp;return;
		}
	};	
};

function ardn(list, item){
	/**
	shortform for array_movedown
	**/
	this.array_movedown(list, item);
};


function array_moveup(rowids, rowid){
	/**
	Moves rowid down one spot in the array
	@param array of rowids or items
	@param rowid to move up array
	**/
	for (var i=1; i<rowids.length; i++){
		if (rowids[i]==rowid){
			var temp=rowids[i-1];
			rowids[i-1]=rowid;
			rowids[i]=temp;
			return rowids;
		}
	};
	return rowids
};

function arup(list, item){
	/**
	shortform for array_movedown
	**/
	return this.array_moveup(list, item);
};


function array_remove(list, item){
	/**
	copy rows array before modifying it
	**/
	var pos=list.indexOf(item);
	if (pos > -1){list.splice(pos, 1);}
	return list;
};


function array_rowidorder(rows, rowids){
	/***
	Modifies rows, reordering its items by rowid key as listed in rowids 
	@param rows Eg. [{rowid:1, ...}, {rowid:2, ...}, ...]
	@param rowids Eg. [2,1,3,4,5...]
	***/

	//copy rows array before modifying it
	var orig=[]; for (var i in rows){orig[i]=rows[i];}
	
	var getrowbyid=function(rowid){
		for(var i in orig){
			//console.log("GET rowid, orig[i]", rowid, orig[i].rowid);
			if (orig[i].rowid==rowid) {	return orig[i];	}
		} 
		//default 
		return null;
	};
	
	var r=null, j=0;
	for (var i in rowids){
		//console.log("FOR rows[i], getrowbyid", rows[i], getrowbyid( rowids[i] ) )
		r=getrowbyid( rowids[i] );
		if (r != null) {rows[j]=r; j++;}
	};
	
	//delete any remaining 
	while (j<rows.length){rows.splice(j,1); j++;}
	
};

function arorder(list, item){
	/**
	shortform for array_movedown
	**/
	this.array_rowidorder(list, item);
};

////////////////////////////////////////////////////////////////

const autoForm=function(div$, params){
	//params={SQL:"SELECT...", table:"projects", rows:[{pnum:"abc", pname:"abc",...},{},{}], ccsclass:[]}

	var con$=$("<div class='container-fluid'></div>");	
	div$.empty();
	div$.append(con$);

	var labl$=$("<h3 class='label label-default'>"+params.table+"</h3>");
	var form$=$("<form></form>");
	form$.submit(function(ev){
		ev.preventDefault();
		//get values from fields including one with SQL or 
		//submitHandler()
	});
	con$.append(labl$, form$);
	
	var row, ig$, name$, inpt$;
	for (var i in params.rows){
		row=params.rows[i];
		ig$=$("<div class='input-group'></div>");
		for (var j in row){
			name$=("<span class='input-group-addon'>"+ j +"</span>");
			inpt$=("<input name='"+ row[j] +"' class='form-control' type='text'  placeholder='...' 		aria-describedby='basic-addon1' value='"+row[j]+"'>");
			ig$.append(name$, inpt$);
		}
		form$.append(ig$);		
	}
	
	var bg1$=$("<div class='btn-group' role='group' aria-label='...'>");
	var btn1=$("<button class='btn btn-default'>Add</button>");
	var btn2=$("<button class='btn btn-default'>Current</button>");
	var btn3=$("<button class='btn btn-default'>Delete</button>");
	var btn4=$("<button class='btn btn-default'>Save</button>");
	var btn5=$("<button class='btn btn-info'>First</button>");
	var btn6=$("<button class='btn btn-info'>&lt;&lt;&nbsp;Back</button>");
	var btn7=$("<button class='btn btn-info'>Next&nbsp;&gt;&gt;</button>");
	var btn8=$("<button class='btn btn-info'>Last</button>");
	bg1$.append(btn1, btn2, btn3, btn4, btn5, btn6, btn7, btn8);
	form$.append(bg1$);
	return con$;
};



function cookie(cname, cvalue, exdays) {
	
	if (typeof cvalue=="undefined"){
		//GET COOKIE
		//console.log("getCookie...", cname);
		var name = cname + "=";
		var decodedCookie = decodeURIComponent(document.cookie);
		var ca = decodedCookie.split(';');
		//console.log("ca...", ca);	
		for(var i = 0; i <ca.length; i++) {
			var c = ca[i];
			while (c.charAt(0) == ' ') {
				c = c.substring(1);
			}
			if (c.indexOf(name) == 0) {
				return c.substring(name.length, c.length);
			}
		}
		return null;
	} 
	else {
		//SET COOKIE
		//console.log("setCookie...");
		if (typeof exdays=="undefined"){exdays=7;}
		var d = new Date();
		d.setTime(d.getTime() + (exdays*24*60*60*1000));
		var expires = "expires="+ d.toUTCString();
		document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
		return cvalue;
	}

};

function database(sql, callback){
	
	$.ajax({
		//url: '/formHandler',
		url: '/database',
		type: 'POST',
		data: jQuery.param({SQL:sql}),
		contentType: 'application/x-www-form-urlencoded; charset=UTF-8',
		success:function(result){ 
			if(typeof result.rows=="undefined") result.rows=[];
			if (typeof callback=="function") callback(result);
		},
		error:function(err){console.log("database function, ajax error:",err);}
	});	
};


//////////////////////////////////
// TEXTEDITOR
// init...
// var ed=new Editor();
// example (icTV is a casbah TableView obj)
// <div onclick="ed.text(this, function(){icTV.update(ed.row(), ed.rowid()); ed.hide();})" ...>

function Editor(){
	
	var that=this;
	
	this.e$=null; //editee - initialized by this.text()
	
	this.fit=function(){
		if (this.e$==null){return;}
		that.x$.show();
		//fit textarea to element	
		that.x$.width(that.e$.width());
		that.x$.css("height","auto");
		that.x$.css("padding-left", that.e$.css("padding-left"));
		if (that.x$[0].scrollHeight > 0) {that.x$.css("height", that.x$[0].scrollHeight);}
		//element to match textarea height
		that.e$.height(that.x$.height()+5);
		//this needs to be done last per trial-and-error
		that.x$.position({my:'left top', at:'left top', of:that.e$});
		//progress backup of edited value
		that.e$.attr("newval", that.x$.val());
	};
	
	this.hide=function(){
		that.x$.hide();
		$(window).off("resize", that.fit);
		//restore row height of previously accessed elements 
		//select elements with onclick attribute. 
		//Re. jquery notation...
		//^= means matches value as begining 
		//*= means matches value as substring 
		//~= means matches value as space delimited word
		$("[onclick*='.text(']").css("height","auto");
	};
	
	this.text=function(el, dblclick){

		//restore row height of any previously edited elements
		$("[onclick*='.text(']").css("height","auto");
	
		that.e$=$(el); 
		that.x$=$("#texteditor");
		
		//update editors dblclick callback to the current edited element
		//dblclick meant to commit the texteditors change
		if (typeof dblclick=="function"){that.x$.off("dblclick").on("dblclick", dblclick);};
		
		//all this newval was working not anymore. Lose it? 
		//newval allows for edit to resume editing on an element that was left without commiting
		var newval=that.e$.attr("newval");
		if (typeof newval=="undefined") {
			//first time this element is edited so initialize editor from element
			that.x$.val(that.e$.text());
			that.x$.attr("newval", that.e$.text());
		} else {
			//resume editing from last edited value
			that.x$.val(newval);
		}
		that.fit();
	};
	
	this.row=function(){
		var row={};
		//row[that.e$.attr("field")]=that.e$.attr("newval");
		row[that.e$.attr("field")]=that.x$.val();
		//console.log("EDITOR field, newval, row...", that.e$.attr("field"), that.e$.attr("newval"), row);
		return row;
	};
	
	this.rowid=function(){
		var rowid=that.e$.attr("rowid");
		//console.log("EDITOR rowid...", rowid);
		return rowid;
	};
	
	//INIT
	//create text area element for editing text
	this.x$=$("<textarea id='texteditor' style='z-index=999;'></textarea>");
	$("body").append(this.x$);
	this.x$.hide();
	
	//initialize or reset various event handlers...
	this.x$.on("click keyup resize", that.fit);
	$(window).on("resize", that.fit);
	
};

////////////////////////////////
// Highlighter
// 

function Highlighter(colour){
	var that=this;
	this.colour=colour;
	this.selector="";
	this.__rowid="-1";
	
	this.light=function(element){
		//element can be this of a DOM element or a jquery id selector
		if (typeof element=="string"){that.selector=element; element=$(element);}
		else if (typeof element=="undefined"){element=$(that.selector);};
		$(".highlite").removeClass("highlite");
		$(element).addClass("highlite");
		that.__rowid=$(element).attr("rowid");
	}
	this.rowid=function(){	return Number(that.__rowid);}	
	
	this.row=function(){
		//return all {name:vals}
		var f;
		//collect all elements within the highlighted div that have fields
		var ff=$(".highlite").find("[field]");
		console.log("field count", ff.length);
		var r={};
		//r[ff.attr("field")]=ff.text();
		//for (var i in ff){
		//	f=ff[i];
		//	r[$(f).attr("field")]=f.text();
		//}
		return r;
	}
};

///////////////
function renderFX(placeholderID, templateFN, result, delta){

	if (placeholderID.indexOf("#")!=0){placeholderID="#"+placeholderID;}
	switch(delta.count){
		case(1):
			////Grand Reveal for added row then run callback function to render result
			$(placeholderID).html(templateFN(result));
			//var cr$=$('#comments-row'+delta.rowids[0]);
			var cr$=$(placeholderID+" > div").find($("[rowid="+delta.rowids[0]+"]"));
			cr$.css('background','gold').hide().show(500, function(){cr$.css('background','white');});
		break;
		case(-1):
			var cr$=$(placeholderID+" > div").find($("[rowid="+delta.rowids[0]+"]"));
			////Grand send-off for deleted row then run callback function to render result
			cr$.css('background','gold').hide(500, function(){
				$(placeholderID).html(templateFN(result));
			});
		break;
		default: $(placeholderID).html(templateFN(result));
	};		
}

function showMenu(cm$, ev){
	//first call texteditor with no arguments to turn it off just in case its on
	ed.hide();
	cm$.show().position({my:'left top',	at:'left bottom', of:ev});
	//remember caller, that is the <div> or <p> element that launched the contextMenu
	cm$.menu('option', 'caller', ev.target);
	return false;
};

///////////////////////////
function substitute(sql, params){
	/**************
	Returns a string from sql with key:value substitutions from params {} 
	Note that placeholders for substitution must have '$' prefix
	sql = "WHERE rowid in ( $rowidlist )"
	params = {$rowidlist:"1,2,3,4"}
	*************/
	//exit early
	if (typeof params=="undefined || params==null"){return sql;}

	//console.log("sql_params...")
	//ensure these aren't touching terms
	sql=sql.replace(/\(/g, " ( "); 
	sql=sql.replace(/\)/g, " ) ");
	sql=sql.replace(/=/g, " = ");
	sql=sql.replace(/,/g , " , ");
	//console.log("sql after grooming...", sql)
	var terms=sql.split(" ");
	for (var i in terms){
		//term starts with '$' so a parameter, substitute it with it's corresponding vlaue
		if ( terms[i].indexOf("$")==0 ) {
			//console.log("term before...", terms[i].substring(1))
			var p=params[terms[i]];
			//add quotes if p is literal
			if (typeof p =="string") {p="'"+p+"'";}
			//evaluate if a function - hopfully the result is a string
			else if (typeof p=="function") {p=p();}
			//convert to string if an array
			else if (p instanceof Array) {p=p.join(",");}
			//////////////
			terms[i]=p;
			//console.log("term after...", terms[i])
		}		
	}
	return terms.join(" ");
};


///////////////////////////
// Table

function TableView(options){
	this.options=$.extend({
		//name of table
		table:"issues",
		//default row
		defrow:{
			pnum:"test-001", 
			description:"New issue", 
			by:"--", 
			dateopened:Date(), 
			dateclosed:"NA", 
			refs:"123"
		},
		//main selector - default below selects all 
		filter:"rowid = rowid",
		//parameters for main selection - default below
		params:null,
		//placeholder element (wrapped with jquery) where table results are displayed for default renderer
		place$:null,
		//fn to run to refresh placeholder, should encapsulate handlebar template etc
		refresh:function(result, diff){
			//default render function
			if (this.options.place$==null){
				this.options.place$=$("<div></div>");
				$("body").append(this.options.place$);
			}
			autoform(this.options.place$, $.extend({table:this.table}, result));
		}
	}, options);
	
	this.div$ = null;
	this.previous={rows:[]};
	this.__init();
};

TableView.prototype.add=function(callback){this.insert(callback);};

TableView.prototype.__init=function(){
	var SQL1=this.SQLselectFirst();
	var SQL2=this.SQLinsert(this.options.defrow);
	//create table (if not exists) then add default row (if none exists)
	database(this.SQLcreate(), function(){
		database(SQL1, function(result){if (result.rows.length==0) {
			database(SQL2);
		}});
	});
};


TableView.prototype.insert=function(callback){
	/**
	Inserts a new row into the table. The new row is as defined in tableView.options.defrow
	@arg callback (as function) Called following table insert operation with a results hash passed as an argument. 
	Accessing the new row is done like so... function(results){var newrowid=results.rows[0].rowid;}
	@arg callback (as boolean true) Means run the standard refresh function defined for this tableview.options.refresh
	if no arg is provided then the insert operation happens without any callback.
	**/
	//console.log("insert...");
	var that=this;
	var then;
	
	if (typeof callback=="function"){
		//callback to get new rowid then pass it to callback provided in arg
		//wrapper just adds to result a shortcut to property rowid (Ie. the id of the newly added row}
		var wrapper=function(r){$.extend(r,{rowid:r.rows[0].rowid});callback(r);}
		then=function(){database(that.SQLselectLast(), wrapper);};
	} 
	else if (typeof callback=="boolean" && callback==true){
		//callback to run standard table select then refresh
		then=function(){database(that.SQLselect(), that.__refresh);}
	}
	else {
		//empty callback
		then=function(){};
	}
	
	//database(SQLstring, callback);
	database(this.SQLinsert(this.options.defrow), then);

};

TableView.prototype.option=function(optionRev){
	//eq. optionRev={filter:"rowid=rowid LIMIT 1"};
	if (typeof optionRev=="undefined"){return this.options;}
	$.extend(this.options, optionRev);	
};

TableView.prototype.remove=function(rowid, callrefresh){
	/**
	Removes row number rowid from the table. The rowid number is not reused. Although the SQL operation is delete, the function is named remove since delete is reserved

	@param rowid - id or row to remove from table
	@param callrefresh - if present, table renderer will be called after database operation
	**/
	//console.log("REMOVE rowid...", rowid);
	var that=this;
	var re=function(result){
		if (typeof callrefresh!="undefined"){that.__refresh(result);}
	}	
	database(this.SQLdelete(rowid), function(){
		database(that.SQLselect(), re);
	});
};


TableView.prototype.refresh=function(){
	//console.log("Refresh...");
	var that=this;
	database(that.SQLselect(), function(result){that.__refresh(result);});
};
//shortform
TableView.prototype.re=function(){ this.refresh();};

//internal use only
TableView.prototype.__refresh=function(result){

	if (result.rows.length==0){console.log("No result for SQL:", this.SQLselect());}

	//calculate the change...
	var rowids=result.rows.map(function(i){return i.rowid;});
	var previds=this.previous.rows.map(function(i){return i.rowid;});
	//console.log("INSERT rowidsPre, rowids", JSON.stringify(rowidsPre), JSON.stringify(rowids));
	var change={
		count:( result.rows.length - this.previous.rows.length ), 
		rowids:array_diff(rowids, previds)
	};
	this.previous=result;
	//console.log("__refresh change:", JSON.stringify(change));

	//call refresh
	try { this.options.refresh(result, change);} 
	catch(er) {
		console.log("tableView "+this.options.table+", trouble with refresh function:",er);
	}
};

TableView.prototype.save=function(row, rowid, callrefresh){
	/** Shortcut for TV.update **/
	this.update(row, rowid, callrefresh);	
};

TableView.prototype.update=function(row, rowid, callrefresh){
	//console.log("Update SQL:", this.SQLupdate(row, rowid));
	//console.log("Update rowid, row...", rowid, JSON.stringify(row));
	var that=this;
	var re=function(result){if (typeof callrefresh!="undefined"){that.__refresh(result);}};

	database(this.SQLupdate(row, rowid), function(){
		database(that.SQLselect(), re);
	});
};

//////////// SQLfunctions
TableView.prototype.SQLcreate=function(){
	//var make="CREATE TABLE ";
	var make="CREATE TABLE IF NOT EXISTS ";
	var sql= make + this.options.table +
	" ( "+Object.keys(this.options.defrow).join(", ")+" ) ";
	//console.log("SQL...", sql);
	return sql;
};

TableView.prototype.SQLdelete=function(rowid){
	var sql= "DELETE FROM "+this.options.table+" WHERE rowid="+rowid;
	//console.log("SQL...", sql);
	return sql;
};

TableView.prototype.SQLinsert=function(row){
	//array of keys
	var keys=Object.keys(row);
	//array of quoted values
	var vals=keys.map( function(k){return ("'"+row[k]+"'");} ); 
	var sql="INSERT INTO "+this.options.table+" ( " + keys.join(", ") + " ) VALUES ( "+vals.join(", ")+" )";
	//console.log("Table SQL:", sql);
	return sql;
};

TableView.prototype.SQLselect=function(){
	var sql= "SELECT rowid, * FROM "+this.options.table+
	" WHERE "+substitute(this.options.filter, this.options.params);
	//console.log("Table SQL:", sql);
	return sql;
};

TableView.prototype.SQLselectFirst=function(){
	return ("SELECT rowid, * FROM " + this.options.table + " LIMIT 1");
};

TableView.prototype.SQLselectLast=function(){
	return ("SELECT rowid, * FROM " + this.options.table + " ORDER BY rowid DESC LIMIT 1");
};

TableView.prototype.SQLupdate=function (row, rowid){
	/***
	Returns the SQL for updating the table as defined in options.table
	@param row - object {} of name:values to be updated
	@param rowid of row in SQLITE database to update 
	***/
	//console.log("UPDATE row, rowid...",JSON.stringify(row), rowid);

	if (typeof row == "undefined" || typeof rowid == "undefined"){return;}
	var keys=Object.keys(row); //array of keys
	//array of assignments ["pnum='BLDG-001'", "field='val'"]
	var pairs=keys.map( function(k){
		//convert [1,2] to "[1,2]" else it's saved as "1,2" which trips JSON.parse() after select
		if (typeof row[k]!="string") {return (k + "='"+JSON.stringify(row[k])+"'");}
		else {return (k + "='"+row[k]+"'");}
	}); 
	var sql="UPDATE "+this.options.table+" SET " + pairs.join(", ") +
	" WHERE rowid="+rowid;
	//console.log("Table SQL:", sql);
	return sql;
};

