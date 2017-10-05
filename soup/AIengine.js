/**********************************
S iddeley's
O pen
U tility
P ackage

Andrew Siddeley
20-Sep-2017
********************************/

window.AIengine=function(options){
	
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
	
	//////////////////////////
	this.data={};
	
	/////////////////////////////////////////////////////////
	this.defs={};
	/**
	this.defsFromHTML=function(pair$){
		var that=this;
		var i$=pairs$.children("left");
		var r$=pairs$.children("right");
		if (i$.length!=r$.length)
			{console.log("Error, lefts and rights are not paired in definitions"); return;}
		else {
			i$.map(function(index, element){
			that.define($(element), $(r$[index]));			
		});}
	};
	**/
	this.define=function(left, right){
		//eg. ("[noun]", "[person]|[place]|[thing]")
		//resolve definitions here, not at match time! 
		//if definition is a function, make sure it returns T/F within 6 recurrsions then store it.
		//if definition is a string and a function seed, prepare the function and store.
		//that should cover all cases.
		var spliter=/[,\s]+/;
		var that=this;
		if (false) {
			//some sort of check, ie. already defined
			console.log("syntax error - text/string arguments expected"); 
			return null;
		}
		else if (right.attr("function")!="undefined") { 
			var arga=right.attr("function").split(splitter);
			var code="try{ "+right.text()+"} catch(er) {console.log(er);}"; 
			var func;
			switch (arga.length){
				case 0:func=new Function(code);break;
				case 1:func=new Function(arga[0],code);break;
				case 2:func=new Function(arga[0],arga[1],code);break;
				case 3:func=new Function(arga[0],arga[1],arga[2],code);break;
				default:func=new Function(arga[0],arga[1],arga[2],arga[3],code);
			}
			this.defs[left]=func;
			console.log("idendity (function):", func);
		}
		else if (right.attr("list")!="undefined") {
			var code="var i=-1; try{ i=["+ right.text() +
			"].indexOf(word);}catch(er){console.log(er);}; return (i==-1)?false:true;"; 
			this.defs[left]=new Function("word", code);
			console.log("idendity (list):", this.defs[left]);
		} 
	};
	
	///////////////////////////////////////////////////////////////////
	this.fn={};
	this.fn.listed=function(item, list){
		//list checker
		//returns true if item is in the list AKA Array
		return (listHash.indexOf(item)!=-1);
	};
	this.fn.hashed=function(item, hash){
		//hash checker
		//returns true if item is a key,
		return (Object.keys(hash).indexOf(item)!=-1);
		//returns true if item is a value in the hash
		//||(Object.values(hash).indexOf(item)=-1);
	};
	this.fn.hashval=function(item, hash){
		return hash(item);		
	};
	
	/////////////////////////////////////////////////////////////////
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
		var that=this;
		this.matchInputStr=this.groom(inputStr);
		//[].some stops at first true, needs false to continue
		this.matchResult=this.pairs.some(function(pair, i){
			//patternResult=that.matchMap(pair.pattern, this.inputStr, 0);
			return that.matchMap(pair.pattern);
		});
	};
	
	this.matchExec=null; //current regex.exec() result as a [] or null if nomatch
	this.matchInputStr=""; //current input string for matching
	this.matchTerm=""; //current regex capture group ie. matchExec[1]..[n]
	this.matchResult=false;
	
	this.matchMap=function(pattern){
		//pattern	{predicates:[fn1, fn2...], regexp:/(term1)(term2)(term3)/}
		//where		a term may be a wildcard at location of predicate such a list checker
		//input  	[word1, word2...]
		//result	[1,1,1,1,0]
		//return	[{head}, {term result}, {term result}...]
		//Example 	[{pattnum:1, match:true, score:0.95}, {term:noun, target:cat, match:true}...]
		var matchResult;		
		var that=this;
		this.matchExec=pattern.regexp.exec(this.matchInputStr);
		//eg. [0]=matching string, [1]..[n]=matched terms, ["index"]=match index in string
		
		//Regex Matches
		if (this.matchExec!=null){
			//Returns true only if all predicates are true. 
			//Also returns true if the predicates array if empty which is good
			matchResult=pattern.predicates.every(function(p,i,a){
				that.matchTerm=that.matchExec[i+1];
				//allways pass aie context to predicates
				//return p.call(that);
				return p(that);
			});	
		}
		return matchResult;
	};

	///////////////////////////////////////////////////
	this.pairsFromHTML=function(pairs$){
		var that=this;
		var p$=pairs$.children("p");
		var a$=pairs$.children("a");
		var i$=pairs$.children("i");
		var r$=pairs$.children("r");
		if ((p$.length!=a$.length)||(i$.length!=r$.length))
			{console.log("Error, (p a) or (i r) elements not paired"); return;}
		else {
			p$.map(function(index, element){
				that.pattern($(element).text(), $(a$[index]).text());			
			});
			i$.map(function(index, element){
				that.define($(element), $(r$[index]));	
			});
		};		
	};
	
	this.pattern=function(patternStr, antiphon){
		//adds a word pattern to wordMatcher
		//[...] hello [punc] my name is [properNoun arg1][...]
		//this.pairs.push({pattern:this.groom(patternStr), response:response});
		this.pairs.push({pattern:this.patternizer(patternStr), antiphon:antiphon});
	};
	
	this.dressup=function(str){
		var s=str.indexOf(0);
		if (s=="$"){
			
		}
		else if (s=="#"){
			//ai.defs['#xxx']
			
		} else if ((s>="0")(s<="9")) {
			//no quotes
			
		}
		
	};
	
	this.patternizer=function(patternStr){
		//Parses patternStr and builds predicates[] and Regexp //
		//patternStr Eg. "$isBotmaster [noun] is * a *"
		//patternStr profile "$predicate $predicate() is * a *"
		//patternStr eg. has 6 terms, term 1, 2, 4 & 6 have regex wildcards
		//For pattern to match, all predicates and regexp must be true. 
		//returns {predicates:[], regexp:RegExp}
		var predicates=[];
		var regexp="";
		var word="(\\w+\\s+)"; //regex capture group for a word
		var nada="()"; //regex capture group to act as a predicate placeholder
		var star="(.*)"; //regex capture group to act as a wildcard for a list tesing predicate
		var flag="i"; //ignore case, global, multiline
		var that=this;
		var profile=patternStr.split(" ").map(function(term, index, arr){
			if (term.charAt(0)=="$"){
				//$hello - predicate variable wrapper
				if (term.charAt(term.length-1)!=")") {
					predicates.push(new Function("ai", "return ai.defs["+term+"];"));
					regexp+=nada;
					return "$predicate";
				}
				//$hello(arg1,$arg2) - predicate function handler
				else {
					var fnam=term.substring(0,term.indexOf("("));
					var args=term.substring(term.indexOf("(")+1, term.indexOf(")"));
					console.log("paternizer term, fnam & args:", term, fnam, "'"+args+"'");
					//what if arg needs to be evaluated?
					//what if arg is a number
					//what if arg is a string
					//what if arg is '' empty, causes syntax err in 244
					//if arg.indexOf(0)=="$" then ai.fn.valueOf(args)
					//else arg is a string or list
					var body="var fn=ai.defs['"+fnam+"']; return fn(ai,"+args+");";
					console.log("body",body);
					var func=new Function("ai", body);
					predicates.push(func);
					regexp+=nada;
					return "$predicate()";
				}
			}
			else if (term.charAt(0)=="[") {
				//[list] - list wrapper
				//eg. term="[nouns]", ai.defs["[nouns]"]=["person","place"]
				predicates.push(new Function("ai",
					//inList(item, list); //returns true if item in list
					"return ai.fn.listed(ai.matchTerm, ai.defs["+term+"]);"
				));
				regexp+=word;
				return "[list]";
			}
			else if (term.charAt(0)=="{") {
				//{list} - hash wrapper
				//eg. term="{nouns}", ai.defs["{nouns}"]={"andrew":"human"}
				predicates.push(new Function("ai",
					"return ai.fn.hashed(ai.matchTerm, ai.defs["+term+"]);"
				));
				regexp+=word;
				return "[list]";
			}
			else if (term.charAt(0)=="*") {regexp+=star;	return "*wildcard";}
			else {regexp+="("+term+"\s)"; return "specific_word";}
		});
		console.log("patternizer profile:",JSON.stringify(profile));
		return {predicates:predicates, regexp:new RegExp(regexp, flag)};
	};
	
	//Pattern Response Storage
	//["["function(words){return true;}, "hello",...][...][...]]
	this.pairs=[];
}; //function


// Define a Module with Simplified CommonJS Wrapper...
// see http://requirejs.org/docs/api.html#cjsmodule
if (typeof define=="function"){
	define(function(require, exports, module){ return aiWordMatcher});
} 
else { 
	//console.log("window.aiWordMatcher", aiWordMatcher);
	//window.aiWordMatcher=aiWordMatcher;
}




