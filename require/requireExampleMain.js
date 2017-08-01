/************************************************************

	This program is free software: you can redistribute it and/or modify
	it under the terms of the GNU General Public License as published by
	the Free Software Foundation, either version 3 of the License, or
	(at your option) any later version.

	This program is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU General Public License for more details.

    You should have received a copy of the GNU General Public License
    along with this program.  If not, see <http://www.gnu.org/licenses/>.

	project:	
	module: 	
	desc: 		Main entry point of app
	by: 		Andrew Siddeley 
	started:	17-Dec-2017
	
*/	

requirejs.config({
	//default baseURL is same as HTML if not explicitly defined however it needs to be
	//the same as jquery for jquery to work because jquery is special, google 'require with jquery' for more. 
	"baseUrl": "../jquery",
	"paths": {
		"modules":"../modules"
		//"jq": "//ajax.googleapis.com/ajax/libs/jquery/2.0.0/jquery.min",
		//"jq":"jquery"
	}
});

// Define a Module with Simplified CommonJS Wrapper...
// see http://requirejs.org/docs/api.html#cjsmodule
define(function(require, exports, module){

// Dependencies...
var $=require('jquery');

//console.log($);

$(function(){
	$('body').text("Hello World from requireExampleMain !");
});

//exports.jq=$;

}); //end of define





