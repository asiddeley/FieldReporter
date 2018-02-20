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
	casbah.database(this.SQLcreate(), function(){
		//then add default row (if none exists)
		casbah.database(SQL1, function(result){if (result.rows.length==0) {
			//then refresh
			casbah.database(SQL2, function(){that.refresh();} );
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
		//Note that.__refresh won't work without it's tableview context so wrap it to make a closure
		var wrapped=function(r){$.extend(r,{rowid:r.rows[0].rowid});callback(r);};
		then=function(){casbah.database(that.SQLselectLast(), wrapped);};
	} 
	else if (typeof callback!="undefined"){
		//callback to run standard table select then refresh.  
		//Note that.__refresh won't work without it's tableview context so wrap it to make a closure
		var wrapped=function(r){that.__refresh(r);}
		then=function(){casbah.database(that.SQLselect(), wrapped);}
	}
	else {
		//empty callback
		then=function(){};
	}
	
	//resolve row, it's either an object {field:value, ...} or a function that returns a fresh object
	var row=this.options.defrow; if (typeof row=="function") {row=row();}
	
	//add new row to table, then execute callback that will receive the new row in its argument...
	casbah.database(this.SQLinsert(row), then);

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
	casbah.database(this.SQLdelete(rowid), function(){
		casbah.database(that.SQLselect(), re);
	});
};


TableView.prototype.refresh=function(){
	//console.log("Refresh...");
	var that=this;
	casbah.database(that.SQLselect(), function(result){that.__refresh(result);});
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
		rowids:casbah.array_diff(rowids, previds)
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
	//console.log("SAVE ", JSON.stringify(row), " where rowid=", rowid);
	this.update(row, rowid, callrefresh);	
};

TableView.prototype.update=function(row, rowid, callrefresh){
	//console.log("Update SQL:", this.SQLupdate(row, rowid));
	//console.log("Update rowid, row...", rowid, JSON.stringify(row));
	var that=this;
	var re=function(result){
		//console.log("update:", callrefresh);
		if (typeof callrefresh!="undefined"){that.__refresh(result);}
	};

	casbah.database(this.SQLupdate(row, rowid), function(){
		casbah.database(that.SQLselect(), re);
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

TableView.prototype.SQLupdate=function (row, rowid ){
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
		//row definition ///// should be a function to provide latest params
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
		filter:" dnum = $dnum AND pnum = $pnum",
		params:params,
		refresh:function(){console.log("Render function not yet defined.");}
	};
}