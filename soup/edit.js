/**********************************
S imple
O pen
U tility
P ackage

Andrew Siddeley

19-Apr-2016
06-Aug-2017
********************************/

// Define a Module with Simplified CommonJS Wrapper...
// see http://requirejs.org/docs/api.html#cjsmodule
define(function(require, exports, module){

var edit=function(list, index, remove, ins){
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

console.log("edit loaded");

return edit;

}); //define
