/**********************************
S imple
O pen
U tility
P ackage

Andrew Siddeley

19-Apr-2016
03-Aug-2017
********************************/


// Define a Module with Simplified CommonJS Wrapper...
// see http://requirejs.org/docs/api.html#cjsmodule
define( function(require, exports, module) {

var soup={};
var $=require('jquery');
var $$=require('jquery-ui');


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


soup.db=require('soup/database');

soup.docName=require('soup/docName');

soup.edit=function(list, index, remove, ins){
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

	
///////////////////////////////////////////////////////////////
	
soup.isJpg=function(path){
	var ext=path.substring(path.lastIndexOf('.')+1); 
	if (ext.toUpperCase()=="JPG") return true;
	else return false;
}



soup.isPic=require('soup/isPic');

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

soup.localPath=require('soup/localPath');
soup.localPicArray=require('soup/localPicArray');
soup.localPicItem=function(){return picItem;}


soup.result=function(id){
	//returns the result from soup widget of given id
	//console.log('get returns:'+key);
	return $(id).cell('result')||$(id).pocket('result');
}


//exports.soup=soup;
//console.log('soup window.soup --- ',window.soup);

//blend in database functions...
//$.extend(soup, require('soup/database'));

soup.cell=require('soup/cell');
soup.foreach=require('soup/foreach');

console.log('all SOUP modules loaded');


return soup;

}); //define


