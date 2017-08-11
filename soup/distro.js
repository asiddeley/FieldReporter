/**********************************
SOUP - Siddeley Open Utility Package
AFC - Andrew's Function Collection
SFC - Siddeley's Function Collection
JFC - Javascript Function Collection

19-Apr-2016
06-Aug-2017
********************************/

// Define a Module with Simplified CommonJS Wrapper...
// see http://requirejs.org/docs/api.html#cjsmodule
define(function(require, exports, module){

	var ieSaveFile=require('soup/ieSaveFile');
	var localPath=require('soup/localPath');

	/********
	var distro=function( ){
		//writes obj to file
		//save soup distributable
		var prop;
		var str='{\n';
		
		for (var key in obj){
			prop=obj[key];
			console.log(key);
			str+=key+':'+JSON.stringify(prop)+'\n';
		};
		
		str+='}\n';
		
		ieSaveFile(  localPath(filename), str );
	};
	**********/
	
	var replacer=function(key, valu){	
		if (typeof valu == 'function'){ return "FUNC000 "+valu.toString()+" FUNC999";	}
		return valu; 
	};
	
	var distro=function(){
		var str=JSON.stringify(soup, replacer, ' ');
		str=str.replace(/"FUNC000/g,"");
		str=str.replace(/FUNC999"/g,"");
		ieSaveFile(localPath('soup/dist/soup.js'), str);
	};
	
	//console.log("distro loaded");
	return distro;
}); //define
