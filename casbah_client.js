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
}

function database(sql, callback){
	$.ajax({
		//url: '/formHandler',
		url: '/database',
		type: 'POST',
		data: jQuery.param({SQL:sql}),
		contentType: 'application/x-www-form-urlencoded; charset=UTF-8',
		//callback(result)
		success:callback,
		error:function(err){/*console.log("ajax error",err);*/}
	});	
};

/******************************
	Returns the result of the subtraction method applied to
	sets (mathematical concept).

	@param a Array one
	@param b Array two
	@return An array containing the result
	
	https://radu.cotescu.com/javascript-diff-function/

*/

function diffArray(a, b) {
	//ensure a is larger, swap if not
	if (a.length < b.length) {var t=a; a=b; b=t;}
	
	var seen = []
	var diff = [];
	for ( var i = 0; i < b.length; i++) { seen[b[i]] = true; }
	for ( var i = 0; i < a.length; i++) { if (!seen[a[i]]) { diff.push(a[i]);}}
	return diff;
}


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
		var d = new Date();
		d.setTime(d.getTime() + (exdays*24*60*60*1000));
		var expires = "expires="+ d.toUTCString();
		document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
		return cvalue;
	}

};

///////////////////////////
function substitute(sql, params){
	/**************
	Returns a sql string based on sql with key:value substitutions from params {} 
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
			//convert to string if an array
			else if (p instanceof Array) {p=p.join(",");}
			terms[i]=p;
			//console.log("term after...", terms[i])
		}		
	}
	return terms.join(" ");
};


////////////////////////////////
// Highlighter
// 

function Highlighter(colour){
	this.colour=colour;
	var that=this;
	
	this.light=function(element){
		//TO DO restore elements previous background, not whitewash
		$(".highlite").css("background-color","white");
		//console.log("HIGHLITE...", $("[highlite=1]").length);
		$("[highlite=1]").attr("highlite",0);
		$(element).css("background-color",that.colour).addClass("highlite");
		$(element).attr("highlite",1);
	}
	
	this.rowid=function(){return $("[highlite=1]").attr("rowid");}	
}


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
		
		//initialize or reset various event handlers...
		//that.x$.off("click keyup resize", that.fit).on("click keyup resize", that.fit);
		//$(window).off("resize", that.fit).on("resize", that.fit);
		if (typeof dblclick=="function"){that.x$.off("dblclick").on("dblclick", dblclick);};
		
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
		row[that.e$.attr("field")]=that.e$.attr("newval");
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
	this.x$=$("<textarea id='texteditor' style='display:none; z-index=999;'></textarea>");
	$("body").append(this.x$);
	
	//initialize or reset various event handlers...
	that.x$.on("click keyup resize", that.fit);
	$(window).on("resize", that.fit);
	
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
			refs:"123"},
		//main selector - default below selects all 
		select:"rowid = rowid",
		//parameters for main selection - default below
		params:null,
		//placeholder element (wrapped with jquery) where table results are displayed for default renderer
		place$:null,
		//fn to run to refresh placeholder, should encapsulate handlebar template etc
		render:function(result){
			//default render function
			if (this.options.place$==null){
				this.options.place$=$("<div></div>");
				$("body").append(this.options.place$);
			}
			autoform(this.options.place$, $.extend({table:this.table}, result));
		}, 
		//fn to run following render if row count decreases (IE delete success)
		reless:function(result){console.log("reless...");}, 
		//fn to run following render if row count increases (IE insert success)
		remore:function(result){console.log("remore...");}
	}, options);
	
	//properties
	this.count = {current:0, previous:0};
	this.div$ = null;
	this.result={rows:[]};
	
	//init
	this.init();
};

TableView.prototype.init=function(){
	var that=this;
	//need to encapsulate that.render, 'this' context changes when inside database fn
	var render=function(result){that.render(result);};
	//database(SQLstring, callback);
	database(this.SQLcreate(), function(){database(that.SQLselect(), render);});
};

TableView.prototype.insert=function(){

	var that=this;
	
	//need to encapsulate that.render because 'this' context changes when render passed as callback
	var render=function(result){that.render(result);};
	
	//database(SQLstring, callback);
	database(this.SQLinsert(this.options.defrow),function(){database(that.SQLselect(), render);});

};

TableView.prototype.options=function(optionRevs){
	$.extend(this.options, optionRevs);	
};

TableView.prototype.remove=function(rowid){
	//delete from database
	//database(SQLstring, callback);
	//console.log("REMOVE rowid...", rowid);
	var that=this;
	var render=function(result){that.render(result);}	
	database(this.SQLdelete(rowid), function(){database(that.SQLselect(), render);});

};

TableView.prototype.render=function(result){
	
	//update stats
	var rowids=result.rows.map(function(i){return i.rowid;});
	var rowidsPre=this.result.rows.map(function(i){return i.rowid;});
	//console.log("INSERT rowidsPre, rowids", JSON.stringify(rowidsPre), JSON.stringify(rowids));
	var rowid=diffArray(rowids, rowidsPre)[0];
	console.log("DIFF", rowid);
	
	this.result=result;
	this.count.previous=this.count.current;
	this.count.current=result.rows.length;

	//run applicable render function
	if (this.count.previous < this.count.current) {
		//number of rows increased
		try { this.options.remore(result, rowid);} 
		catch(err){console.log(err); }
	} else if (this.count.previous > this.count.current) {
		//number of rows decreased
		//try { this.options.reless(result, this.rowid("highlite"));} 
		try { this.options.reless(result, rowid);} 
		catch(err){console.log(err); }
	} else { 
		//number of rows unchanged
		try { this.options.render(result);} 
		catch(err){console.log(err); }
	}
}
/********************
TableView.prototype.row=function(hint){
	//retrieves from 'that' elment, field, value and returns them as {} for use in update(row, rowid)
	//console.log("ROW field:newval...", $(that).attr("field"), $(that).attr("newval") );
	var that$;
	var r={};

	if (typeof hint=="undefined"){
		that$=$("[edit-in-progress=1]").attr("newval");
		r[that$.attr("field")]=that$.attr("newval");
		return r;
	} else if (hint=="highlite"){
		that$=$("[highlite=1]").attr("newval");
		r[that$.attr("field")]=that$.attr("newval");
		return r;
	} else {return r;}
}

TableView.prototype.rowid=function(hint){
	//returns active rowid for use in update(row, rowid)

	if (typeof hint=="undefined"){
		return $("[edit-in-progress=1]").attr("rowid");
	} else if (hint=="highlite"){
		//console.log("ROWID...", $("[highlite=1]").attr("rowid"));
		return $("[highlite=1]").attr("rowid");		
	} else {return 0;}
}
*/
TableView.prototype.update=function(row, rowid){
	//console.log("UPDATE row, rowid:", JSON.stringify(row), rowid);
	var that=this;
	var render=function(result){that.render(result);}	
	database(this.SQLupdate(row, rowid), function(){database(that.SQLselect(), render);});
};
//////////// SQLfunctions
TableView.prototype.SQLcreate=function(){
	var sql="CREATE TABLE IF NOT EXISTS "+
	this.options.table+
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
	" WHERE "+substitute(this.options.select, this.options.params);
	//console.log("Table SQL:", sql);
	return sql;
};

TableView.prototype.SQLupdate=function (row, rowid){
	//row = {} //object of any fields to be updated
	//rowid = 21 //SQLITE automatic row id 
	//console.log("UPDATE row, rowid...",JSON.stringify(row), rowid);
	if (typeof row == "undefined" || typeof rowid == "undefined"){return;}
	var keys=Object.keys(row); //array of keys
	//array of assignments ["pnum='BLDG-001'", "field='val'"]
	var pairs=keys.map( function(k){return (k + "='"+row[k]+"'");} ); //array of quoted values
	var sql="UPDATE "+this.options.table+" SET " + pairs.join(", ") +
	" WHERE rowid="+rowid;
	//console.log("Table SQL:", sql);
	return sql;
};