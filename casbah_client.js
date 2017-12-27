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

function autoHeight(el) {$(el).css('height', 'auto').css('height', el.scrollHeight + 5);}

function database(sql, callback){
	$.ajax({
		url: '/formHandler',
		type: 'POST',
		data: jQuery.param({SQL:sql}),
		contentType: 'application/x-www-form-urlencoded; charset=UTF-8',
		success:callback,
		error:function(err){/*console.log("ajax error",err);*/}
	});	
};

//function dataNextid
/****
function dataInsert(params){
	//params_example = {
	//	table:"comments",
	//	row:{itemno:"", pnum:"", svrnum:"", comment:"", idrefs:""},
	//	rows:[],
	//	where:{pnum:"bldg00-01", svrnum:"svr-001"}
	//}
	
	var sql="INSERT INTO " + params.table + 
	" ( " + Object.keys(params.row).join(", ") + " ) "+
	"VALUES ('" + Object.values(params.row).join("', '") + "' ) ";
	console.log("ASSEMBLED SQL:"); console.log(sql);
	
	$.ajax({
		url: '/formHandler',
		type: 'POST',
		data: jQuery.param({SQL:sql}),
		contentType: 'application/x-www-form-urlencoded; charset=UTF-8',
		success:function(result){console.log("SUCCESS with dataInsert");},
		error:function(err){console.log("ERROR with dataInsert");}
	});
}

function dataSelect(params, onSuccess, onErr){
	//template is a compiled handlebars template function
	//elementid is the DOM id of the element where the template function renders the results
	//params={
	//	table:"comments",
	//	row:{itemno:"", pnum:"", svrnum:"", comment:"", idrefs:""},
	//	rows:[],
	//	where:{pnum:"bldg00-01", svrnum:"svr-001"}
	//}

	
	if (typeof onSuccess=="undefined"){onSuccess=function(result){console.log(result);}};
	if (typeof onErr=="undefined"){onErr=function(err){console.log(err);}};
	
	var WHERE="";
	if (typeof params.where == "object"){
		var expr=Object.keys(params.where).map(function(key){return key + " = '" + params.where[key] + "' ";});
		WHERE=" WHERE (" + expr.join(" AND ") + " ) ";
	}
	
	var sql="SELECT * FROM " + params.table + WHERE
	console.log("ASSEMBLED SQL:"); console.log(sql);
	
	
	//var sql="SELECT * FROM " + params.table + " " +
	//"WHERE ( pnum='"+cpnum+"', svrnum='" + csvrnum + "' ) "+
	//"ORDER BY itemno";
	//console.log("ASSEMBLED SQL:");console.log(sql);

	$.ajax({
		url: '/formHandler',
		type: 'POST',
		data: jQuery.param({SQL:sql}),
		contentType: 'application/x-www-form-urlencoded; charset=UTF-8',
		success: onSuccess,
		error: onErr
	});
}

function dataUpdate(params){
	//params_example = {
	//	SQL:"UPDATE...",
	//	table:"comments",
	//	row:{itemno:"", pnum:"", svrnum:"", comment:"", idrefs:""},
	//	rows:[],
	//	where:{pnum:"bldg00-01", svrnum:"svr-001"}
	//}

	//if (typeof params.row == "object"){
	//	expr=Object.keys(params.row).map(function(key){return key + "='" + param.row[key] + "'";});
	//}
	//var sql="UPDATE " + params.table + " " +
	//"SET ( " + expr.join(", ") + " ) "+
	//"WHERE " +;
	//console.log("ASSEMBLED SQL:");console.log(sql);

	console.log("SQL:"); console.log(params.SQL);

	$.ajax({
		url: '/formHandler',
		type: 'POST',
		data: jQuery.param({SQL:params.SQL}),
		contentType: 'application/x-www-form-urlencoded; charset=UTF-8',
		success:function(result){console.log("SUCCESS with dataUpdate");},
		error:function(err){console.log("ERROR with dataUpdate");}
	});
}
********************/

/****
//DEPRECATED
const ieSplice=function(list, index, remove, ins){
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
}
***/


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



