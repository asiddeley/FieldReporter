/**********************************
S imple
O pen
U tility
P ackage

Andrew Siddeley
24-Sep-2017
********************************/

// Define a Module with Simplified CommonJS Wrapper...
// see http://requirejs.org/docs/api.html#cjsmodule
// define(function(require, exports, module){

window.aiEnglishGrammar={

	//Oxford Guide to English Grammar
	//Word Classes 8
	wordClasses:{
		adjectives:"good, british, cold, quick".split(", "),
		adverbs:"quickly always approximately".split(" "),
		conjunctions:"and but so".split(" "),
		determiners:"the, his, some, forty-five".split(", "),
		nouns:"Andrew, home, book, car, cat, magazine".split(", "),
		prepositions:"to of at on".split(" "),
		pronouns:"we you them myself".split(" "),
		verbs:"climb, eat, welcome, be".split(" "),
	},
	
	//Phrases 5
	phrases:{
		//adjective phrase examples
		adjectivePhrase:"pleasant, very late".split(", "),
		adverbPhrase:"quickly, always certainly".split(", "),
		//noun phrase - adjective* noun+ determiner
		nounPhrase:"a good flight, his crew".split(", "),
		verbPhrase:"come, had thought, was left, will be climbing".split(", "),
		//prepositional phrase - praposition + noun phrase
		preposition:"after lunch, on the aircraft".split(", ")
	}
}; //English Grammar

// Define a Module with Simplified CommonJS Wrapper...
// see http://requirejs.org/docs/api.html#cjsmodule
if (typeof define=="function"){define(function(require, exports, module){ return aiEnglishGrammar});} 
else {window.aiEnglishGrammar=aiEnglishGrammar;}


//}); //define
