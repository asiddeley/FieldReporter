var express = require('express');
var fs = require('fs');
var url = require('url');
var path = require('path')

var app = express();

app.get('/', function (req, res) {
	res.sendFile(path.join(__dirname + "/cazbar.html"))

});

//logger
app.use(function(req, res, next){
	console.log("LOG...",req.url);
	next();
});


//serve static files
//console.log("STR->", path.join(__dirname, 'xrefs'));
//app.use(express.static(path.join(__dirname, '../'))); //to get parent path
app.use(express.static(path.join(__dirname)));

app.listen(8080, function () {
  console.log('Example app listening on port 8080!')
});