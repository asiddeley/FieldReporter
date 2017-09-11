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

return ieSplice;

}); //define
