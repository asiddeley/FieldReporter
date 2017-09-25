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
			this.fn[left]=right;
			//console.log(this.fn[left]);
		}
		else if ((typeof right == "string")&&(right.search("|")!=-1)){
			//definition contains an operator	
			//create function that compares range word to right words (rw)
			var rightWords=right.split("|");
			this.fn[left]=function(word, index, range){
				//loops through matches until true (matched), otherwise returns false
				return rightWords.some(function(rw){return (word==rw);});
			}
			//console.log(this.fn[left]);
		} 
		else if (typeof right == "string"){	
			//definition right value is just a string so
			//create simple function that compares it to the word provided from range 
			this.fn[left]=function(word, index, range){return(word==right);};
			//console.log(this.fn[left]);
		};		
			
	};
	
	//this.definitions=[];
	
	//function storage - Ie. resolved definitions
	//functions stored here will be called thus: function(word, index, range){...} 
	//and be expected to return a result object based on this.resultDefault({match:true...})
	this.fn={};  
	
	this.fn["fnNotFound"]=function(word){
		//filter to handle a common error
		//return this.resultDefault({exit:true, msg:"error, ["+word+"] not defined"});
	};
	
	//name of "..." actually works!
	this.fn["..."]=function(word){
		//filter similar to * that matches any word
		//return this.defaultResult({match:true, word:word});
	};
	
	this.groom=function(str){
		//grooming returns a clean array of words
		//console.log("before",str);
		//ensure good separation by padding various separators and punctuators
		str=str.replace(/\]/g,"] "); 
		str=str.replace(/\.\s/g," . "); //ignores [...] and chaining periods such as www.com
		str=str.replace(/,/g," , ");
		//TO DO - ampersand&, comma, exclamation!, question mark?, quote"  

		//split at spaces
		return str.split(/\s+/gm);
	};
	
	////////////////////////////////////////	
	this.match=function(rangeStr){
		//var match=this.match;
		var that=this;
		var range=this.groom(rangeStr);
		//itterate through patterns until match found
		this.results=[];
		var innerResult=[];
		//[].some stops at first true, needs false to continue
		this.pairs.some(function(pair, i){
			innerResult=that.matchPatternToRange(pair, range, 0);
			that.results.push(innerResult);
			//match patterns with input range, exit on first positive match 
			//returning true will exit the some loop
			//pattern positive only if all terms are true
			var irr=innerResult.reduce(function(a, i){return (a && i.match);}, true);
			//console.log("ir", JSON.stringify(ir));
			return irr;
		});
		return this.results;		
	};
	
	this.matchPatternToRange=function(pair, range, level){
		/********************
		.some tests the parts of the pattern against the range, continue if matched, exit at first mismatch. Note that some() exits when callback returns true (so need to negate match result).  
		.map on the other hand, tests all parts whether match is true or false.
		pattern=[d,w,  f,w,  f]  
		range  =[w,w,w,w,w,w,w,w,w,w,w,w]
		result =[1,1,1,1,0]
		where d=function derived in define, f=function directly defined & w=function derived from word
		*****************/
		level=(typeof level=="undefined")?0:level++; //recursion level if required
		
		var that=this;
		//var that=this;
		var move=0; //mover offset, so that 'star' or '...' funtion can move the pattern along the range
		
		//start off true, anding 1 false will negate all. 
		//all functions of a pattern must be true (and) so exit after first false 
		
		var result=pair.pattern.map(function(term, i, a){
			//f, i, a - pattern match function, index, array ie. pattern
			var match=false; 
			var target=range[move+i];
			if (move+i < range.length){
				var fn=that.fn[term];
				if (typeof fn == "function"){ match=fn(target, i, a);}
				//function fn not found so just compare strings 
				else {match=(term==target);}
			} 
			else { match=null; } //dummy result for map
			return {term:term, target:target, match:match};
		});
		//return this.createResult({matches:r});
		//result=[{term:noun, target:Andrew, match:true}]
		return result;
	};
	

	
	this.pattern=function(patternStr, response){
		//adds a word pattern to the wordMatcher
		//[...] hello [punc] my name is [properNoun arg1][...]
		//split at: space spaces comma square-brackets
		//this.patterns.push(patternStr.split(/\s|,|\x5b|\x5d/gm));
		
		this.pairs.push({pattern:this.groom(patternStr), response:response});

	};
	
	//Pattern Storage
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




