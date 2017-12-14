/**********************************

Contract
Admin
Site SQL database
Built for
Architectural
Heros

Andrew Siddeley

13-Dec-2017
********************************/


const autoForm($div, table, field, valu){
	$div.empty();
	var $labl=$("<h3 class='label label-default'>"+table+"</h3>");
	var $cont=$("<div class='container-fluid'></div>");
	var $form=$("<form></form>");
	var $ig=$("<div class='input-group'></div>">
	
	<span class="input-group-addon" >Project number</span>
	<input id="pnum" name="pnum" class="form-control" type="text"  placeholder="..." aria-describedby=
	
}

const autoFormField($div, name, valu)


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



function getCookie(cname) {
	console.log("getCookie...", cname);
    var name = cname + "=";
    var decodedCookie = decodeURIComponent(document.cookie);
    var ca = decodedCookie.split(';');
	console.log("ca...", ca);	
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
	console.log("setCookie...");
    var d = new Date();
    d.setTime(d.getTime() + (exdays*24*60*60*1000));
    var expires = "expires="+ d.toUTCString();
    document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
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



