/**********************************
S iddeley's
O pen
U tility
P ackage

Andrew Siddeley
20-Sep-2017
********************************/

window.aiWordMatcher=function(options){
	
	if (this===window) {return new aiWordMatcher(options);};

	this.createResult=function(options){
		/***
		returns a new result object with all default field:vlaues and allows specified fields to be overidden via options object.  Non-jQuery code - Object.create({options});
		***/
		options=(typeof options == "undefined")?{}:options;
		return $.extend({},{
			matched:false,
			patternStr:"",
			range:"",
			score:0,
		}, options);	
	};
	
	this.define=function(left, right){
		//eg. ("[noun]", "[person]|[place]|[thing]")
		//resolve definitions here, not at match time! 
		//if definition is a function, make sure it returns T/F within 6 recurrsions then store it.
		//if definition is a string and a function seed, prepare the function and store.
		//that should cover all cases.
		var that=this;
		if (typeof left != "string") {
			console.log("syntax error - wordDef requires text/string arguments"); 
			return null;
		}
		else if (typeof right == "function") { 
			this.defs[left]=right;
			//console.log(this.fn[left]);
		}
		else if ((typeof right == "string")&&(right.search("|")!=-1)){
			//definition contains an operator	
			//create function that compares range word to right words (rw)
			var rightWords=right.split("|");
			this.defs[left]=function(word, index, range){
				//loops through matches until true (matched), otherwise returns false
				return rightWords.some(function(rw){return (word==rw);});
			}
			//console.log(this.fn[left]);
		} 
		else if (typeof right == "string"){	
			//definition right value is just a string so
			//create simple function that compares it to the word provided from range 
			this.defs[left]=function(word, index, range){return(word==right);};
			//console.log(this.fn[left]);
		};		
			
	};
	
	this.defineFromHTML=function(){
		var that=this;
		var def$("defs");
		var left$=def$.children("left");
		var right$=def$.children("right");
		if (left$.length<>right$.length)
			{console.log("Error, left-right mismatch in defs"); return;}
		else {
			left$.map(function(index, element){
			that.define($(element).text(), $(right$[index]).text());			
		});}
	};
	
	this.defs={};

	
	this.getBestResponse=function(){
		//find first true match

		var index=-1;
		var response;
		if (this.results.some(function(r){index=r[0].index;	return r[0].match;}))
			{response=this.pairs[index].response;}
		else {response="I don't understand";}
		
		if (typeof response=="function") {return response();}
		else {return response;}
	
	};
	
	this.groom=function(str){
		//grooming returns a clean array of words
		//console.log("before",str);
		//ensure good separation by padding various separators and punctuators
		str=str.replace(/\]/g,"] "); 
		str=str.replace(/\.\s/g," . "); //ignores [...] and chaining periods such as www.com
		//str=str.replace(/,/g," , ");
		//TO DO - ampersand&, comma, exclamation!, question mark?, quote"  

		//split at spaces
		return str.split(/\s+/gm);
	};
	
	////////////////////////////////////////	
	this.match=function(inputStr){
		//To do - scan for illegal text
		var that=this;
		var input=this.groom(inputStr);
		//itterate through patterns until match found
		this.results=[];
		var patternResult=[];
		//[].some stops at first true, needs false to continue
		this.pairs.some(function(pair, i){
			//patternResult=that.matchMap(pair.pattern, input, 0);
			patternResult=that.matchMap(pair.pattern, input);
			//console.log(patternResult);
			patternResult[0].index=i; //identify pattern 
			that.results.push(patternResult);
			return patternResult[0].match; //exit if true otherwise continue
		});
		return this.results;		
	};
	
	this.matchWithRegex=function(pattern, input){
		
		
		
	};
	
	this.matchMap=function(pattern, input, level){
		/******************************
		pattern	[d,w,.,.,f,w,.,.,f]  //Note how buldozers [...] push terms right until matched
		input  	[w,w,w,w,w,w,w,w,w,w,w,w]
		result	[1,1,1,1,0]
		term d	derived function, after a few define itterations
		term f	function defined
		term w	word
		*******************************/
		level=(typeof level!="number")?0:level++; //recursion level if required
		var head={index:0, match:true, comps:0, score:0};		
		var offset=0; //used by buldover to push terms left from begining	
		var that=this;
		var result=pattern.map(function(term, i, a){
			//f, i, a - pattern match function, index, array ie. pattern
			var match=false; 
			var target;

			if (offset+i < input.length){
				target=input[offset + i];
				var fn=that.fn[term];
				if (typeof fn == "function"){ match=fn(target, i, a);}
				//otherwise just compare strings
				else {match=(term==target);} 
				//accumulate overall truth and total for score
				head.match=head.match && match; 
				head.score+=match;
				head.comps+=1; //number of compares 
			} 
			else { target=null; match=null; } //dummy results
			
			return {term:term, target:target, match:match};
		});
		head.score=(head.score/head.count); //get average
		
		//result =[{head}, {term result}, {term result}...]
		//Example [{pattnum:1, match:true, score:0.95}, {term:noun, target:cat, match:true}...]
		return [head].concat(result);
	};

	
	this.pattern=function(patternStr, response){
		//adds a word pattern to wordMatcher
		//[...] hello [punc] my name is [properNoun arg1][...]
		//this.pairs.push({pattern:this.groom(patternStr), response:response});
		this.pairs.push({pattern:this.patternizer(patternStr), response:response});
	};
	
	this.patternizer=function(patternStr){
		//pattern example - 
		//"$predicateVar $predicateFunc(string) *text to match*"
		//later, for pattern to match, all predicates and regex must be true. 
		//returns {predicates:[], regexp:RegExp}
		var predicates=[], regexp="";
		var a=patternStr.split(" ").map(function(term, index, arr){
			//$hello - predicate variable
			//$hello(arg1,arg2) - predicate function ///WHAT about $arg
			if (term.charAt(0)=="$")
				{predicates.push(new Function("return "+term.substring(1)));}
			else if (term.chatAt(0)=="[")
				var end=term.indexOf("]")-1;
				{predicates.push(new Function(
					//"arg1", "arg2",
					"return ai.fn.inList(ai.inputStr,"+term.substring(1,end)+");"
				);}
			//add string to regexStr
			else {regexp+=term+"\s";}
		});
		//translate to regexp since asterisk in regex means 0 or more, not wildcard
		regexp.replace("*",".+"); 
		return {predicates:predicates, regexp:new Regexp(regexp, "i" )};
	};
	

	
	//Pattern Response Storage
	//["["function(words){return true;}, "hello",...][...][...]]
	this.pairs=[];
	this.results=[];

	//this.report=function(){return JSON.stringify(this.result);};
	//this.result=resultDefault();
	
} //function


// Define a Module with Simplified CommonJS Wrapper...
// see http://requirejs.org/docs/api.html#cjsmodule
if (typeof define=="function"){
	define(function(require, exports, module){ return aiWordMatcher});
} 

else { 
	//console.log("window.aiWordMatcher", aiWordMatcher);
	window.aiWordMatcher=aiWordMatcher;
}




