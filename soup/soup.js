/**********************************
S imple
O pen
U tility
P ackage

Andrew Siddeley

19-Apr-2016
03-Aug-2017
********************************/

requirejs.config({
	//baseUrl default (if not defined here) will be same as HTML.  
	//paths below are relative to baseURL
	//jquery special requirement - baseUrl must be the same url as jquery for jquery to work
	baseUrl: "jquery",
	waitSeconds:10, 
	/*Load timeout for modules: soup/soup.js...
	In case others have this issue and still struggling with it (like I was), this problem can also arise from circular dependencies, e.g. A depends on B, and B depends on A.
	The RequireJS docs don't mention that circular dependencies can cause the "Load timeout" error, but I've now observed it for two different circular dependencies.
	https://stackoverflow.com/questions/14279962/require-js-error-load-timeout-for-modules-backbone-jquerymobile
	*/
	paths: {soup:"../soup"}
}); 

// Define a Module with Simplified CommonJS Wrapper...
// see http://requirejs.org/docs/api.html#cjsmodule
define( function(require, exports, module) {

var soup={};
window.soup=soup;
var $=require('jquery');
var $$=require('jquery-ui');

soup.ver="20160825";
soup.pageCount=0;
soup.picItem="1";
soup.rowCount=0;

//soup.anything=require('soup/anything').anything;
//soup.anything$=require('soup/anything').anything$;


//Thanks http://stephanwagner.me/auto-resizing-textarea
soup.autoHeight=function (el) { 
	$(el).css('height', 'auto').css('height', el.scrollHeight + 5);
};

soup.docName=require('soup/docName');

soup.edit=require('soup/edit');
	
soup.isJpg=function(path){
	var ext=path.substring(path.lastIndexOf('.')+1); 
	if (ext.toUpperCase()=="JPG") return true;
	else return false;
};

soup.isPic=require('soup/isPic');
//console.log(soup.isPic);

soup.idfix=function(el, suffix){
	var id=$(el).attr('id');
	$(el).attr('id', id + suffix);
	return soup; //to allow chaining
};

soup.idfixx=function(el, prefix, suffix){
	var id=$(el).attr('id');
	$(el).attr('id', prefix + id + suffix);
	return soup; //to allow chaining
};

soup.localPath=require('soup/localPath');
soup.localPicArray=require('soup/localPicArray');
soup.localPicItem=function(){return picItem;};

soup.result=function(id){
	//returns the result from soup widget of given id
	//console.log('get returns:'+key);
	return $(id).cell('result')||$(id).pocket('result');
};

//blend in database functions...
var db=require('soup/database');
$.extend(soup, db);

//jquery-ui widget setup
soup.cell=require('soup/cell');
soup.foreach=require('soup/foreach');
soup.pocketize=require('soup/pocket');

//soup.contextMenu=require('soup/contextMenu'); //DEPRECATED

console.log('soup loaded');
return soup;

}); //define


