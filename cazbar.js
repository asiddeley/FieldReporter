const express = require('express')
const fs = require('fs')
const url = require('url')
const path = require('path')
const sqlite=require('sqlite3').verbose()
const bodyParser=require("body-parser") 
const casql=require(__dirname+"/zdatabase/casql.js")

//cm.hw()

const app = express()

//Open database
const dbdir = __dirname + '/zdatabase';
const dbpath=dbdir+"/cazbar.db"
try {fs.mkdirSync(dbdir, 0744); console.log("Database folder created.");}
catch(er){console.log("Database folder exists.")}
const db=new sqlite.Database(dbpath)

//ensure database tables created
console.log("casql", casql)
db.serialize( function () {	
	db.run(casql.createTableProjects, function(err){})
	db.run(casql.createTableSVRs, function(err){})
})


process.on("exit", function(){db.close();console.log("Database closed.");})
var sqlcount=1

//Main entry
app.get('/', function (req, res) {res.sendFile(path.join(__dirname + "/views/cazbar.html"));})

//Static file server.  Use '../' to get parent path
app.use(express.static(path.join(__dirname)));

//Static files withouth need for dirname.  Todo move Jquery, Bootstrap, caman etc to node_modules
//var pathToModule = require.resolve('module');



//Logger
app.use(function(req, res, next){console.log("LOG...",req.url);	next();});

//Database form handler and required middleware parsers
app.use( bodyParser.urlencoded({extended: true}));
app.use( bodyParser.json());
app.post('/formHandler', function (req, res) {

	const rows=[]	
	sqlcount+=1	
	let msg="SQL#"+sqlcount.toString()
	const sql=req.body.SQL
	//console.log("SQLs to process...", sqls.length)

	//console.log("SQLs...", sqls);
	try {
		db.serialize( function () {
			//switch based on first term of SQL
			switch(sql.split(" ")[0]){
					
				case "CREATE": 
				case "INSERT": 
				case "UPDATE":
				db.run(sql_params(sql, req.body), function(err){
					var stat=(err==null)?" - db run ok":"db run error - "+err
					console.log(msg + stat)
					res.json({msg:msg+stat, rows:rows})	
				})
				break
				case "SELECT":
				db.all(sql_params(sql,	req.body), function(err, rows){
					var stat=(err==null)?" - db all ok":"db run error - "+err
					console.log(msg + stat)
					res.json({msg:msg+stat, rows:rows})
				})			
				break
				default:
				res.json({msg:msg, rows:rows})					
			}
		})
	} 
	catch(err) {console.log("SQL ERROR...", err)}

})


//start serving
app.listen(8080, function () {console.log('CAzbar server listening on port 8080!')});


//prepare SQL by substituting parameters with corresponding values
function sql_params(sql, params){
	/**************
	Why is this function required when db.run has it built in db.run(sql, params, callback) ?
	Because if params have more elements than the sql has placeholders it throws an error
	This function is more forgiving
	*************/
	
	//console.log("sql_params...")
	//ensure these aren't touching terms
	sql=sql.replace(/\(/g, " ( ") 
	sql=sql.replace(/\)/g, " ) ") 
	sql=sql.replace(/=/g, " = ") 
	sql=sql.replace(/,/g , " , ") 
	//console.log("sql after grooming...", sql)
	var terms=sql.split(" ") 
	for (var i in terms){
		
		//term starts with '$' so a parameter, substitute it with it's corresponding vlaue
		if ( terms[i].indexOf("$")==0 ) {
			//console.log("term before...", terms[i].substring(1))
			terms[i]='"'+params[terms[i].substring(1)]+'"'
			//console.log("term after...", terms[i])
		}		
	}
	return terms.join(" ") //unsplit
}

