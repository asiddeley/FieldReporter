const express = require('express')
const fs = require('fs')
const url = require('url')
const path = require('path')
const sqlite=require('sqlite3').verbose()
const bodyParser=require("body-parser") 

const app = express()

//ensure folder zdatabase exists or there will be an error
const dbpath=path.join(__dirname, "/zdatabase/cazbar.db")

var sqlcount=1

//Main entry
app.get('/', function (req, res) {res.sendFile(path.join(__dirname + "/views/cazbar.html"));})

//Static file server.  Use '../' to get parent path
app.use(express.static(path.join(__dirname)));

//Logger
app.use(function(req, res, next){console.log("LOG...",req.url);	next();});

//Database form handler and required middleware parsers
app.use( bodyParser.urlencoded({extended: true}));
app.use( bodyParser.json());
app.post('/formHandler', function (req, res) {

	const rows=[]	
	//function concatRows(r){rows.concat(r)}
	
	let msg="SQL count:"+sqlcount.toString()
	sqlcount+=1
	let db=new sqlite.Database(dbpath)
	let sqls=req.body.SQL.split(";")
	//console.log("SQLs to process...", sqls.length)

	//console.log("SQLs...", sqls);
	try {
		db.serialize( function () {
			for (var i in sqls){
				var first_term=sqls[i].split(" ")[0]
				switch(first_term){
					
					case "CREATE": 
					case "INSERT": 
					case "UPDATE":
					db.run(sql_params(sqls[i], req.body), function(err){
						console.log("UPDATE(db.run)...", err);
						res.json({msg:"Update", rows:rows})	
					})
					break
					case "SELECT":
					db.all(sql_params(sqls[i],	req.body), function(err, rows){
						console.log("SELECT(db.all)...", err); 
						//res.append("rows", rows);
						res.json({msg:msg, rows:rows})	
					})			
					break
					default:
					res.json({msg:msg, rows:rows})					
				}
			}
		})
	} 
	catch(err) {console.log("SQL ERROR...", err)}

	//send results
	//res.setHeader('Content-Type', 'application/json');
	console.log("Rows...", rows)
	//db.close()	
	//res.json({msg:msg, rows:rows})	
})


//start serving
app.listen(8080, function () {console.log('CAzbar server listening on port 8080!')});


//prepare SQL by substituting parameters with corresponding values
function sql_params(sql, params){
	//console.log("sql_params...")
	//ensure these are not touching term
	sql=sql.replace(/\(/g, " ( ") 
	sql=sql.replace(/\)/g, " ) ") 
	sql=sql.replace(/=/g, " = ") 
	sql=sql.replace(/,/g , " , ") 
	//console.log("sql after grooming...", sql)
	var terms=sql.split(" ") //break SQL into terms (words) 
	for (var i in terms){
		
		//term starts with '$' meaning it's a parameter, substitute it with it's corresponding vlaue
		if ( terms[i].indexOf("$")==0 ) {
			//console.log("term before...", terms[i].substring(1))
			terms[i]='"'+params[terms[i].substring(1)]+'"'
			//console.log("term after...", terms[i])
		}		
	}
	//console.log("SQL...\n", sql)
	//console.log("sql with subs...\n", terms.join(" "))
	return terms.join(" ") //unsplit
}

