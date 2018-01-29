/**********************************
CASBAH is a...
Contract
Admin
Site 
Built-for
Architectural
Heros

Andrew Siddeley

13-Dec-2017
21-Jan-2018
********************************/

if (typeof casbah=="undefined") {casbah={};}



function TableView(options, options1){
	
	this.options=options;
	if (typeof options1=="object") {$.extend(this.options, options1);}
	
	/***
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
	**/
	
	this.div$ = null;
	this.previous={rows:[]};
	this.__init();
};

TableView.prototype.add=function(callback){this.insert(callback);};

TableView.prototype.__init=function(){
	var SQL1=this.SQLselectFirst();
	var SQL2=this.SQLinsert(this.options.defrow);
	var that=this;
	//create table (if not exists) 
	database(this.SQLcreate(), function(){
		//then add default row (if none exists)
		database(SQL1, function(result){if (result.rows.length==0) {
			//then refresh
			database(SQL2, function(){that.refresh();} );
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
	/** TV.update alias **/
	this.update(row, rowid, callrefresh);	
};

TableView.prototype.update=function(row, rowid, callrefresh){
	//console.log("Update SQL:", this.SQLupdate(row, rowid));
	//console.log("Update rowid, row...", rowid, JSON.stringify(row));
	var that=this;
	var re=function(result){
		if (typeof callrefresh!="undefined" && callrefresh==true){that.__refresh(result);}
	};

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

///////////////////////
// Casbah tables

//SQL to retrieve a database table column names or fields: pragma table_info(svrs)


casbah.comments=function(params){
	
	//params should be a reference a to global parameter object 
	if (typeof params=="undefined") {params={};}

	return {
		//table name in database
		table:"comments",
		//row definition
		defrow:{
			pnum:(params.$pnum || "BLDG-001"), 
			comment:"New comment", 
			refs:"[ ]", 
			date:Date(), 
			by:(params.$user || "none")
		},			
		filter:" rowid IN ( $comment_ids )",
		params:params,
		refresh:function(result, delta){}
	};
};


casbah.issues=function(params){
	
	//params should be a reference a to global parameter object 
	if (typeof params=="undefined") {params={};}

	return {
		table:"issues",
		defrow:{
			pnum:(params.$pnum || "BLDG-001"), 
			desc:"New issue", 
			open:Date(), 
			shut:"none", 
			refs:"[ ]", 
			by:(params.$user || "unknown")
		},
		filter:" pnum = $pnum ",
		params:params,
		refresh:function(){console.log("Render function not yet defined.");}
	};
};

casbah.projects=function(params){
	
	//params should be a reference a to global parameter object 
	if (typeof params=="undefined") {params={};}

	return {
		//table name in database
		table:"projects",
		//row definition
		defrow:{
			pnum:(params.$pnum || "BLDG-001"),			
			pname:"The Casbah Building",
			address:"101 Boogie Street, Toronto, Ontario, Canada, Postal-code",
			client:"Client", 
			contractor:"CasbahCon",
			permit:"16 xxxxxx BLD 00 BA",
			date:Date(),
			date_closed:"none",
			status:"status",
			xdata:"none"
		},
		//default filter selects current projects
		filter:" pnum = $pnum ",
		params:params,
		refresh:function(){console.log("Render function not yet defined.");}
	};
};

casbah.siteVisitReports=function(params){
	
	//params should be a reference a to global parameter object 
	if (typeof params=="undefined") {params={};}
	
	return {
		//table name in database
		table:"svrs",
		//row definition
		defrow:{
			pnum:(params.$pnum || "BLDG-001"),			
			dnum:(params.$dnum || "SVR-A01"),
			dtitle:"document title",
			date:Date(),
			date_issued:"none", 
			by:(params.$user || "admin"),			
			comment_ids:"[1,2,3]", 
			issue_ids:"[1,2,3]",
			photo_ids:"[1,2,3]",
			xdata:"none"
		},
		filter:" dnum = $dnum ",
		params:params,
		refresh:function(){console.log("Render function not yet defined.");}
	};
}