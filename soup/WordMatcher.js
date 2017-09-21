/**********************************
S iddeley's
O pen
U tility
P ackage

Andrew Siddeley
20-Sep-2017
********************************/

// Define a Module with Simplified CommonJS Wrapper...
// see http://requirejs.org/docs/api.html#cjsmodule
define(function(require, exports, module){

//DEPRECATED 
//Code below not finished/tested, for record only.
//WordMatcher to be re-coded around Regex instead.

function WordMatcher(options){
	if (this===window) {return new WordPattern(options)};

	this.add=function(patternStr){
		//adds a word pattern to the wordMatcher
		//[...] hello [punc] my name is [properNoun arg1][...]
		//split at: space spaces comma square-brackets
		//this.patterns.push(patternStr.split(/\s|,|\x5b|\x5d/gm));
		
		//grooming...
		//separate adjoining end & start brackets '][' to '] ['
		patternStr.replace(/\x5d\x5b/,"] [");
		//pad around periods
		patternStr.replace(/\./," . ");
		//what about ampersand&, comma, exclamation!, question mark?, quote"  
		//patterStr.replace(...);		
		//split at spaces
		this.patterns.push(patternStr.split(/\s+/gm));

	};
	
	this.define=function(left, right){
		//eg. ("[noun]", "[person]|[place]|[thing]")
		//resolve definitions here, not at match time! 
		//if definition is a function, make sure it returns T/F within 6 recurrsions then store it.
		//if definition is a string and a function seed, prepare the function and store.
		//that should cover all cases.
		var that=this;
		if (typeof left != "string") {
			console.log("syntax error - string required for first argument of define"); 
			return null;
		}
		else if (typeof right == "function") { 
			this.fn[left]=right;
		}
		else if ((typeof right == "string")&&(right.search("|")!=-1)){
			//definition contains an operator	
			//create function that compares word (provided from range) to a list of potential matches
			this.fn[left]=function(word, index, range){
				var matches=right.split("|");
				var result=this.resultDefault({match:false});
				//go through potential matches, compare each with provided word (from range)
				//return true if at least one of them matches (or)
				matches.map(function(m){
					var r=(word==m); 
					result.match=result.match|r; 
					return r;
				});
				return result;
			}
		} 
		else if (typeof right == "string"){	
			//definition right value is just a string so
			//create simple function that compares it to the word provided from range 
			this.fn[left]=function(word, index, range){ 
				return this.resultDefault({match:(word==right)});
			};
		};		
			
	};
	
	//this.definitions=[];
	
	//function storage - Ie. resolved definitions
	//functions stored here will be called thus: function(word, index, range){...} 
	//and be expected to return a result object based on this.resultDefault({match:true...})
	this.fn={};  
	
	this.fn["fnNotFound"]=function(word){
		//filter to handle a common error
		return this.resultDefault({exit:true, msg:"error, ["+word+"] not defined"});
	};
	
	//name as ... actually works!
	this.fn["..."]=function(word){
		//filter similar to * that matches any word
		return this.defaultResult({match:true, word:word});
	};
	
	this.mapComp=function(pattern, range, level){
		//pattern=    [d,w,  f,w,  f] 
		//range  =[w,w,w,w,w,w,w,w,w,w,w,w]
		//result =[1,1,1,1,0]
		//where d=function derived in define, f=function directly defined & w=function derived from word
		level=(typeof level=="undefined")?0:level++;
		
		//var that=this;
		var move=0; //mover offset, so that 'star' or '...' funtion can move the pattern along the range
		var result=true; //start of true, anding 1 false will negate all. 		
		var rm=pattern.map(function(f, i, a){
			//f, i, a - pattern match function, index, array ie. pattern
			
			if (move+i < range.length){
				var r=f(range[move+i], i, a);
				result=result && r.result; //calculate overall result 	
			} else { 
				//pattern is longer than range so return dummy result for leftover
				r=null;
			}			
			return r;
		});
		console.log("pattern map result:",JSON.stringify(rm));
		return this.resultDefault({"result":result});
	};
	
	this.match=function(rangeStr){
		var match=this.match;
		var range=rangeStr.split(" ");
		var pattern, result, i;
		//itterate through patterns
		for (i=0; i<this.patterns.length; i++){
			result=this.mapComp(patterns[i], range);
			if (result.exit==true) return result;
		};
		return result;		
	};
	
	//Pattern Storage
	//["["function(words){return true;}, "hello",...][...][...]]
	this.patterns=[];

	this.resultDefault=function(options){
		//returns a new result object with all default field:vlaues and allows specified fields to be overidden via options object
		//Object.create({});
		options=(typeof options == "undefined")?{}:options;
		return $.extend({},{
			exit:false,
			msg:"",
			match:false,
			range:"",
			score:0,
			word:"",
			wordindex:0,
		}, options);	
	};
	this.report=function(){return JSON.stringify(this.result);}
	this.result=resultDefault();
	
}; //wordMatcher

//WordMatcher test
$(function() { 

	//console.log(window.dbAPI);
	
	var NOUNS="Andrew home book car cat".split(" ");
	
	var pm=new WordMatcher();
	//adds a pattern/token to the PM
	wm.pattern("[noun] is at [noun][verb] a [noun]", 1);
	
	//resolved definition I.e it is a function that returns true or false within 5 recursions
	wm.define("[noun]", function(w, ic){return(NOUNS.indexOf(w)!= -1);}); 
	//unresolved definition - right string has OR operators, words are endpoints since no definitions found 
	wm.define("[verb]", "read|reading|run|running");
	//resolved definition I.e reference made to a hash/dictionary eg. {... read:{meaning:"", sim:[]}...]}}
	//wm.define("[adverb]", "#ADVERB_DICTIONARY");
	
	//unresolved definition - right string has OR operators and words that are definitions 
	//wm.define("[phrase]", "[pronoun][noun]|[noun]")
	wm.match("Andrew is at home, reading a book") // {match:true, score:0.1, response:1, msg:""}
	
	console.log(wm.report());
};

return WordMatcher;

}); //define
