const express = require('express')
const fs = require('fs')
const url = require('url')
const path = require('path')
const sqlite=require('sqlite3').verbose()
const bodyParser=require("body-parser") 

var app = express()

//Main entry
app.get('/', function (req, res) {res.sendFile(path.join(__dirname + "/cazbar.html"));})

//Static file server.  Use '../' to get parent path
app.use(express.static(path.join(__dirname)));

//Logger
app.use(function(req, res, next){console.log("LOG...",req.url);	next();});

/*************************
bodyParser.urlencoded(options)
Parses the text as URL encoded data (which is how browsers tend to send form data from regular forms set to POST)
and exposes the resulting object (containing the keys and values) on req.body

bodyParser.json(options)
Parses the text as JSON and exposes the resulting object on req.body. 
THANKS TO
https://stackoverflow.com/questions/4295782/how-do-you-extract-post-data-in-node-js
*********************/
app.use( bodyParser.urlencoded({extended: true}));
app.use( bodyParser.json());

//Database form handler and required middleware (above)
app.post('/formHandler', function (req, res) {
	//console.log("POST /formHanlder...", req.url) 
	console.log("POST /formHanlder... req.body:", req.body)
	
	let msg="success"
	let db=new sqlite.Database("cazbar.db")
	let sqls=req.body.SQL.split(";")
	let rows=[]
	
	db.serialize(function () {
		for (var i in sqls){
			
			//switch based on first term of current SQL
			switch(sqls[i].split(" ")[0]){
				case "CREATE": 
				db.run(sql_params(sqls[i], req.body), [], function(err){
					console.log("db.run...", err); msg=err 
				})
				case "UPDATE":
				db.run(sql_params(sqls[i], req.body), [], function(err){
					console.log("db.run...", err);
					msg=err 
				})
				case "SELECT":
				db.each(sql_params(sqls[i], req.body), [], function(err, row){
					console.log("db.each...", err, row);
					rows.push(row)
					msg=err 
				})
			}
		}
	})
	db.close()	
	
	//send results
	res.send({msg:msg, rows:rows})
})


//start serving
app.listen(8080, function () {console.log('CAzbar server listening on port 8080!')});


//prepare SQL by substituting parameters with corresponding values
function sql_params(sql, params){
	//ensure these are not touching term
	sql=sql.replace("(", " ( ") 
	sql=sql.replace(")", " ) ") 
	sql=sql.replace("=", " = ") 
	sql=sql.replace(",", " , ") 
	var terms=sql.split(" ") //break SQL into terms (words) 
	for (var i in terms){
		//term starts with '$' meaning it's a parameter, substitute it with it's corresponding vlaue
		if ( terms[i].indexOf("$")==0 ) {
			terms[i]=params[terms[i].substring(1)]
		}		
	}
	console.log("SQL...", sql, "...after substitutions...", terms.join(" "))
	return terms.join(" ") //unsplit
}

