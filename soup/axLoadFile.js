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
define(function(require, exports, module){

/*******************************************
Soup ajax database functions
A Siddeley
25-May-2016
********************************************/
var axLoadFile=function(col){

	// col = mongo style collection eg. {field1:"val1", field2:{field21:"hello"}...}
	// A Siddeley, 25-May-2016
	
	try {
		//"q" example - return all documents with "active" field of true:
		//https://api.mlab.com/api/1/databases/my-db/collections/my-coll?q={"active": true}&apiKey=myAPIKey
		var db="soupdb";
		var api="get this from mlab";
		return ($.ajax({
			//url: "https://api.mlab.com/api/1/databases/"+db+"/collections/"+col+"?apiKey="+api,
			url: "mongodb://<dbuser>:<dbpassword>@ds015909.mlab.com:15909/soupdb"
			type: "GET",
			contentType: "application/json"
		}));

	} catch(ex) { console.log("axLoadFile failed ", ex);	return null;	}
}

console.log("axLoadFile loaded");
return axLoadFile;

}); //define
