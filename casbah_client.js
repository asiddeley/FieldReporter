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
	
}

function database(sql, callback){
	$.ajax({
		//url: '/formHandler',
		url: '/database',
		type: 'POST',
		data: jQuery.param({SQL:sql}),
		contentType: 'application/x-www-form-urlencoded; charset=UTF-8',
		success:callback,
		error:function(err){/*console.log("ajax error",err);*/}
	});	
};


function getCookie(cname) {
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
};

function setCookie(cname, cvalue, exdays) {
	//console.log("setCookie...");
    var d = new Date();
    d.setTime(d.getTime() + (exdays*24*60*60*1000));
    var expires = "expires="+ d.toUTCString();
    document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
	return cvalue;
};


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

///////////////////////////
function substitute(sql, params){
	/**************
	Returns a sql string based on sql with key:value substitutions from params {} 
	sql = "WHERE rowid in ( $rowidlist )"
	params = {$rowidlist:"1,2,3,4"}
	*************/
	
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
			terms[i]=params[terms[i]];
			//console.log("term after...", terms[i])
		}		
	}
	return terms.join(" ");
};


//////////////////////////////////
function texteditor(element, dblclick){

	var x$=$("#texteditor");
	
	//create editor element if not found
	if (x$.length==0){
		x$=$("<textarea id='texteditor' style='display:none; z-index=999;'></textarea>");
		$("body").append(x$);
	}

	//no argument means hide editor
	if(typeof element=="undefined"){
		x$.hide();
		//restore row height of previously accessed elements 
		$("[onclick^='texteditor']").css("height","auto");
		$(window).off("resize", texteditorFit);
		return;
	};

	//activate texteditor on element
	var e$=$(element);
	
	//restore row height of any previously edited elements
	//$(".texteditor").css("height","auto");
	//selects elements with onclick attribute begining with texteditor...
	$("[onclick^='texteditor']").css("height","auto");
	
	//clear flags
	$("[edit-in-progress]").attr("edit-in-progress",0);
	//flag current element being edited
	e$.attr("edit-in-progress", 1);
	
	//initialize or reset various event handlers...
	x$.off("click keyup resize", texteditorFit).on("click keyup resize", texteditorFit);
	$(window).off("resize", texteditorFit).on("resize", texteditorFit);
	if (typeof dblclick=="function"){x$.off("dblclick").on("dblclick", {texteditor:x$}, dblclick);};
	
	//get database rowid, field and value info and save as attributes for possible update
	x$.attr("rowid", e$.attr("rowid"));
	x$.attr("field", e$.attr("field"));
	x$.val( e$.text() );
	
	texteditorFit();	
};

function texteditorFit(){
	var x$=$("#texteditor");
	var e$=$("[edit-in-progress=1]"); //attribute selector 
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

function Table(options){
	this.options=$.extend({
		table:"comments",
		fields:["itemno", "pnum", "svrnum", "comment", "refs"],
		values:[1,"bldg-001","svr-001", "new comment", "1,2,3"],
		selection:"WHERE rowid in ( $rowidlist )",
		substitutions:{$rowidlist:"1,2,3,4"},
		renderer:function(result){}
	}, options);	
};

Table.prototype.insert=function(index){

	//get row that called the menu, caller is set by showMenu() 
	//var caller=CM$.menu("option", 'caller'); 
	
	//index of that was clicked
	//var index=parseInt($(caller).attr("rank"));
	
	//Make way for newbie...
	//var u1="UPDATE comments SET itemno=itemno+1 "+
	//"WHERE pnum='"+cpnum+"' AND svrnum='"+csvrnum+"' AND CAST (itemno AS INTEGER) > "+index;
	//database(u1);
	
	//Add newbie... Substitute itemno 
	var newrow=$.extend({}, commentsEntry, {itemno:(Number(index)+1), comment:"new comment"}); 
	database(SQLinsert(newrow));

	commentsRender(function(){
		//grand reveal for the new row 
		$('#comments-placeholder').children('[rank="'+(index+1)+'"]').css('background','tan').hide().show(500);
	});

};


Table.prototype.remove=function(rowid){
	//delete from database
	database(this.SQLdelete(rowid));
	database(this.SQLselect(), this.options.renderer);

	/**
	//refresh comments
	database(SQLselectComments(cpnum, csvrnum),	function(result){
		//console.log("delete refresh result < CC... ", result.rows.length, commentsCount, (typeof rowid), rowid);
		
		//test if DELETE actually removed a row then update rank column for remaining rows
		if (result.rows.length < commentsCount){
			//console.log("# selected for deletion..." ,$("#commentsRow"+rowid).length);
			//grand send off and removal 
			$("#commentsRow"+rowid).css('background','tan').hide(500, function(){
				var u1="UPDATE comments SET itemno=itemno-1 "+
				"WHERE pnum='"+cpnum+"' AND svrnum='"+csvrnum+"' AND CAST (itemno AS INTEGER) > "+index;
				database(u1);
				commentsRender();
			});
		}
	});
	**/

};

Table.prototype.update=function(row, rowid){

	database(this.SQLupdate(row, rowid), this.renderer);

};


Table.prototype.SQLdelete=function(rowid){
	var sql= "DELETE FROM "+this.options.table+" WHERE rowid="+rowid;
	//console.log("SQL...", sql);
	return sql;
};

Table.prototype.SQLinsert=function(row){
	var keys=Object.keys(row); //array of keys
	var vals=keys.map( function(k){return ("'"+row[k]+"'");} ); //array of quoted values
	var sql="INSERT INTO "+this.options.table+" ( " + keys.join(", ") + " ) VALUES ( "+vals.join(", ")+" )";
	console.log("Table SQL:", sql);
	return sql;
};

Table.prototype.SQLselect=function(){
	var sql= "SELECT rowid, * FROM "+this.options.table+
	substitute( this.options.selection, this.options.substitutions);
	console.log("Table SQL:", sql);
	return sql;
};

Table.prototype.SQLupdate=function (row, rowid){
	var keys=Object.keys(row); //array of keys
	var vals=keys.map( function(k){return ("'"+row[k]+"'");} ); //array of quoted values
	var sql="UPDATE comments ( " + keys.join(", ") +
	" ) VALUES ( "+vals.join(", ")+
	" ) WHERE rowid="+rowid;
	console.log("Table SQL:", sql);
	return sql;
};

