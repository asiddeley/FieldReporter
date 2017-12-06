const express = require('express')
const fs = require('fs')
const url = require('url')
const path = require('path')
const sqlite=require('sqlite3')
const bodyParser=require("body-parser") 

var app = express()


app.use( bodyParser.urlencoded({extended: true}));
app.use( bodyParser.json());

app.get('/', function (req, res) {
	res.sendFile(path.join(__dirname + "/cazbar.html"))

})

app.post('/sql', function (req, res) {
	console.log("POST...", req.url, JSON.stringify(req.params))
	
	let msg="success"
	var zb=sqlite("cazbar.db")
	zb.serialize(function () {
		zb.run(req.params.sql, [], function(err){console.log(err); msg=err })
	})
	zb.close()
	//res.send(msg)
	res.end()
})


app.post('/formHandler', function (req, res) {
	//console.log("POST /formHanlder...", JSON.stringify(req.params))
	console.log("POST/formHanlder... req.body:", req.body)
	
	
	res.end()
})


//logger
app.use(function(req, res, next){
	console.log("LOG...",req.url)
	next()
});


/*************************
bodyParser.urlencoded(options)
Parses the text as URL encoded data (which is how browsers tend to send form data from regular forms set to POST)
and exposes the resulting object (containing the keys and values) on req.body

bodyParser.json(options)
Parses the text as JSON and exposes the resulting object on req.body. 
THANKS TO
https://stackoverflow.com/questions/4295782/how-do-you-extract-post-data-in-node-js
*********************/


//serve static files
//app.use(express.static(path.join(__dirname, '../'))); //to get parent path
app.use(express.static(path.join(__dirname)));

//start serving
app.listen(8080, function () {console.log('Example app listening on port 8080!')});


////////////////////////////////////
//zoombase Cazbar Database
//

function sqliteExample(){

	var zb=sqlite(':memory:')
	zb.serialize(function () {

		zb.run('CREATE TABLE ipsum (info TEXT)')
		var stmt = zb.prepare('INSERT INTO ipsum VALUES (?)')
		for (var i=0; i<10; i++) {stmt.run('value '+i)}
		stmt.finalize()

		zb.each('SELECT rowid AS id, info FROM ipsum' , function (err, row) {
			console.log(row.id + ': ' + row.info)
		})
	})
	zb.close()
}

