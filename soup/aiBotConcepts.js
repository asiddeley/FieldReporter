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

//question-response atom
function PR(p, r){
 //Pattern(s)
 this.p=p;
 //Response(s)
 this.r=r;
 //Score
 this.s=0;
}

//Core Text Responses
responses=[
new PR(["you", "hi", "hello", "hail"], "hi" ), //simple substitution
new PR([/how are you ?/], function(ai){return (ai.status.mood >= 0.5)?"Good":"Not so good";} ),
new PR([/do you like */], function(ai){return ai.goodness(ai.input.pattern.star)?"yes":"no";} ),

]




//console.log("growBot loaded");

return [PR, responses];

}); //define


/**************
LOGOS
A Siddeley
21-Sep-2017

Monolito
MONOLITO
MONOLITO[ai]
MONOLaiTO
monolAIto

  ?   Q  (~)(*)(-)(Y)!& ? (?)
['|']
[= =]
[...]

  ?
['!']
[= =]
[...]

  ?
['_']
[= =]
[...]

  !
['|']
[= =]
[...]

  Q  
['^'] Looks like a pig
[= =]
[...]


  Q    Light bulb, thought bubble, Question
['|']
[= =]
[...]
  

  Q    
['|']
[ = ]
[...]

      
['|'][input text]
[___][===][---][-=-][ + ][!!!][response...]
[...]

['|']
[E =]
[,,,]

********************/



/*********************
Monolito decorators
A Siddeley
23 Sep 2017

Turn-dialog Training:
question 			?
response example 	?!
statement			!
example				!!
False statement		^
False example		^^

Patterns (spaces, quotes, commas not allowed):
literal		[name]
variable 	[var]
value/eval	[$name]
eval w args	[$fun_hello_world]  //if fun is a function	
assigment	[#a:hello] 	//variable a is now "hello"
assigment	[b:$a]		//variable b asssignd value of a, which is "hello"
var name 	[c:hello]
var name	[$c:value_of_Hello] //variable hello=value of hello
class		[$obj.prop]
and 		[bool&bool]
or			[exp|exp]
not			[exp~exp]
math		exp:1-2*3/4%1(+$a+$b)^2
conditional	[res:true=false:()^()]
objects		[a:span_1_9}{span_A_Z}]
skipto/rest	[...]
seed		[
******************/
