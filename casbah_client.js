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

function highlite(that){
	$(".highlite").css("background-color","white");
	$(that).css("background-color","skyblue").addClass("highlite");
}

/**
//DEPRECATED - use database instead
function submitHandler(param, onsuccess, onerror){
	$.ajax({
		url: '/formHandler',
		type: 'POST',
		//data: jQuery.param({sql: "SELECT name FROM projects"}),
		data: jQuery.param(param),
		contentType: 'application/x-www-form-urlencoded; charset=UTF-8',
		//success: function (response) {$("#result").text(JSON.stringify(response));},
		//error: function () {$("#result").text("error");	}
		success:onsuccess,
		error:onerror
	}); 
};
****/

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


//////////////////////////////////
// TEXTEDITOR

function texteditor(element, dblclick){

	var x$=$("#texteditor");
	
	//create editor element if not found
	if (x$.length==0){
		x$=$("<textarea id='texteditor' style='display:none; z-index=999;'></textarea>");
		$("body").append(x$);
	}

	//no argument means hide editor
	if(typeof element=="undefined" || element==null){
		x$.hide();
		//restore row height of previously accessed elements 
		$("[onclick^='texteditor']").css("height","auto");
		$(window).off("resize", texteditorFit);
		return;
	};

	//activate texteditor on element
	var e$=$(element);
	
	var data={texteditor:x$, x$:x$, element:e$, e$:e$};
	
	//restore row height of any previously edited elements
	//$(".texteditor").css("height","auto");
	//selects elements with onclick attribute begining with texteditor...
	$("[onclick^='texteditor']").css("height","auto");
	
	//clear flags
	$("[edit-in-progress]").attr("edit-in-progress",0);
	//flag current element being edited
	e$.attr("edit-in-progress", 1);
	
	//initialize or reset various event handlers...
	x$.off("click keyup resize", texteditorFit).on("click keyup resize", data, texteditorFit);
	$(window).off("resize", texteditorFit).on("resize", data, texteditorFit);
	if (typeof dblclick=="function"){x$.off("dblclick").on("dblclick", data, dblclick);};
	
	//get database rowid, field and value info and save as attributes for possible update
	x$.attr("rowid", e$.attr("rowid"));
	x$.attr("field", e$.attr("field"));
	x$.val( e$.text() );
	
	//dummy ev with critical data member as argument
	texteditorFit({data:data});	
};

function texteditorFit(ev){
	//var x$=$("#texteditor");
	//var e$=$("[edit-in-progress=1]"); //attribute selector
	var x$=ev.data.texteditor;
	var e$=ev.data.element;
	
	x$.show();
	//fit textarea to element	
	x$.width(e$.width());
	x$.css("height","auto");
	x$.css("padding-left", e$.css("padding-left"));
	if (x$[0].scrollHeight > 0) {x$.css("height", x$[0].scrollHeight);}
	//element to match textarea height
	e$.height(x$.height()+5);
	//this needs to be done last per trial-and-error
	x$.position({my:'left top', at:'left top', of:e$});
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
		fxless:function(result){console.log("fxless...");}, 
		//fn to run following render if row count increases (IE insert success)
		fxmore:function(result){console.log("fxmore...");}
	}, options);
	
	//row count
	this.count = {current:0, previous:0};
	this.div$ = null;
	this.result={};
	
	

};

TableView.prototype.init=function(){
	var that=this;
	//need to encapsulate that.render, 'this' context changes when inside database fn
	var render=function(result){that.render(result);};
	//database(SQLstring, callback);
	database(this.SQLcreate(), database(this.SQLselect(), render));
};

TableView.prototype.insert=function(row){

	var that=this;
	//need to encapsulate that.render, 'this' context changes when inside database fn
	var render=function(result){that.render(result);};
	//database(SQLstring, callback);
	database(this.SQLinsert(row), database(this.SQLselect(), render));

};

TableView.prototype.options=function(optionRevs){
	$.extend(this.options, optionRevs);	
};

TableView.prototype.remove=function(rowid){
	//delete from database
	//database(SQLstring, callback);
	var that=this;
	var render=function(result){that.render(result);}	
	database(this.SQLdelete(rowid), database(this.SQLselect(), render));

};

TableView.prototype.render=function(result){

	//update stats
	this.result=result;
	this.count.previous = this.count.current;
	this.count.current=result.rows.length;
	//run the provided renderer
	try { this.options.render();} catch(err){console.log(err); }
	if (this.count.previous < this.count.current) {
		try { this.options.fxmore(result);} catch(err){console.log(err); }
	} else if (this.count.previous > this.count.current) {
		try { this.options.fxless(result);} catch(err){console.log(err); }
	}
}

TableView.prototype.update=function(row, rowid){
	var that=this;
	var render=function(result){that.render(result);}	
	database(this.SQLupdate(row, rowid), database(this.SQLselect(), render));

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
	var keys=Object.keys(row); //array of keys
	var vals=keys.map( function(k){return ("'"+row[k]+"'");} ); //array of quoted values
	var sql="INSERT INTO "+this.options.table+" ( " + keys.join(", ") + " ) VALUES ( "+vals.join(", ")+" )";
	console.log("Table SQL:", sql);
	return sql;
};

TableView.prototype.SQLselect=function(){
	var sql= "SELECT rowid, * FROM "+this.options.table+
	" WHERE "+substitute(this.options.select, this.options.params);
	console.log("Table SQL:", sql);
	return sql;
};

TableView.prototype.SQLupdate=function (row, rowid){
	var keys=Object.keys(row); //array of keys
	var vals=keys.map( function(k){return ("'"+row[k]+"'");} ); //array of quoted values
	var sql="UPDATE "+this.options.table+" ( " + keys.join(", ") +
	" ) VALUES ( "+vals.join(", ")+
	" ) WHERE rowid="+rowid;
	console.log("Table SQL:", sql);
	return sql;
};

