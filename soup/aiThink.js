/**********************************
S iddeley's
O pen
U tility
P ackage

Andrew Siddeley

19-Apr-2016
11-Sep-2017
********************************/

// Define a Module with Simplified CommonJS Wrapper...
// see http://requirejs.org/docs/api.html#cjsmodule
define(function(require, exports, module){

//Function Creator (FC) make functions for aiBot
//About the resulting functions:
//analogous to a neurons in a neural net
//lisp like in that they are self contained, but side effects are encouraged through context 
//
//ARGS
//input - an input that the created function can expect 
//output - the desired output tht the created function should return from that input or ? if unkown
//ai - includes.. ai, designer specs (specs), designed functions (dfn), status,
//
//EXAMPLES
//var fn=FC([1, 2, 3, 4], 10 , {hint:"sum"}); //returns function where..
//fn(1,2,3,4) returns 10
//var fn=FC("how are you", function(ai){(ai.states.mood>=0.5)?"Good":"Not so good";}, ai );

//analogous to AIML
//Core Text Responses
responses=[
new PR(["you", "hi", "hello", "hail"], "hi" ), //simple substitution
new PR([/how are you ?/], function(ai){return (ai.status.mood >= 0.5)?"Good":"Not so good";} ),
new PR([/do you like */], function(ai){return ai.goodness(ai.input.pattern.star)?"yes":"no";} ),
]




/*
Syntax
new Function ([arg1[, arg2[, ...argN]],] functionBody)

Parameters
arg1, arg2, ... argNNames to be used by the function as formal argument names. Each must be a string that corresponds to a valid JavaScript identifier or a list of such strings separated with a comma; for example "x", "theValue", or "a,b".

functionBody
A string containing the JavaScript statements comprising the function definition.
*/


function think(input, output, ai){

 if (typeof ai!={}) return "Sorry, ai is wrong."

 //analyze input
 var r
 switch (typeof input){
	case 'undefined': 
		try{r=ai.fn.thinkUndefined(input, output, ai);} catch(er){r=er;}; 
	break;
	
	case 'object': 
		if (input instanceof 'Array')
		{try {r=ai.fn.thinkArray(input, output, ai);} catch (er){r=er.toString();}}
		else if (input instanceof 'null')
		{try {r=ai.fn.thinkNull(input, output, ai);} catch (er){r=er.toString();}}
		else 
		{try {r=ai.fn.thinkObject(input, output, ai)} catch (er){r=er.toString();};
	break;
	
	case 'number': 
		return ai.fn.thinkNumber(input, output, ai); 
	break;
	
	case 'string': 
		return ai.fn.fcInputIsString(input, output, ai); 
	break;
	
	default:
		R="???";
 }
 
 return r;
}



/////////////////////
//English syntax

function Word(){
	//part of a sentence, grouping of letters 
	this.extends=function(){};
};

function Noun(){
	//people place or thing
	//extends word...
	Word.call(this); 
	this.prototype=Object.create(Word.prototype); 
	this.prototype.constructor=Noun; 

	
};






//console.log("growBot loaded");

return think;

}); //define
