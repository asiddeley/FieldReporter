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

	var stringifyFunc=function(str){
		var funcReplacer=function(key, func){	
			if (typeof func == 'function'){ 
				//add easily identifiable wrappers to funciton string 
				func= "FUNC000 "+func.toString()+" FUNC999";	
				return encodeURI(func.toString());
			} else {return func; }
		};
		
		var str=JSON.stringify(str, funcReplacer, ' ');
		//get rid of wrappers  "FUNC000 function(){...} FUNC999" 
		str=str.replace(/"FUNC000|FUNC999"/g,"");
		return(decodeURI(str));
	};
	
	//console.log("distro loaded");
	return stringifyFunc;
}); //define
