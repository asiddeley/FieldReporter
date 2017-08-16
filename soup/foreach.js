/**********************************
S imple
O pen
U tility
P ackage

Andrew Siddeley

19-Apr-2016 - Early
01-Aug-2017 - Modularized
**************************/

// Define a Module with Simplified CommonJS Wrapper...
// see http://requirejs.org/docs/api.html#cjsmodule
define(function(require, exports, module){

var $=require('jquery'); //load jquery
//var $$=require('jquery-ui'); //load widget
var db=require('soup/database');


$.widget("soup.foreach", {
	
	/******
	<div class='soup-foreach' soup-foreach='["a", "b", "c"]'>
	<p soup-action='$(this.child).text(this.index1)'>elements to be repeated</p>
	</div>
	child:	current new element eg: '<p>elements to be repeated</p>' then '<p>elements to be...
	index:	current loop count, eg: 0 then 1 then 2
	index1:	current loop count starting at 1, eg: 1 then 2 then 3
	item:	current loop argument eg: "a" then "b" then "c"
	
	TODO - MAKE IT WORK IN CASE WHERE FOREACH IS NESTED IN A FOREACH
	***/
	child: null, 
	index: 0, 
	index1: 1,
	item: 99, 
	template: '<div class="row"><p>item</p><p>desc</p><p>ref</p></div>',
	
	
	options: {
        name: 'foreach1',
		items: [1, 2, 3],
    },
	
	_create: function() {
		//read defaults from html tag/content
		//console.log('foreach create...');
		this.template=this.element.html();
		$.extend(this.options,{
			name:this.element.attr('id'),
			items:eval(this.element.attr("soup-foreach")) //convert from string to array
		});

		this.options=$.extend(this.options, db.load(this.options));
		this.refresh();
    },
	
	
	_destroy: function() {
        //this.element.removeClass( "savable" ).text( "" );
    },
	
    _setOption: function( key, valu ) {
       //if ( key === "valu" ) { valu = this._checkValu( valu );  }
       this._super( key, valu );
	},
	
	_setOptions: function( options ) {
        this._super( options );
        this.refresh();
    },

	items: function(arg, callback){
		switch (typeof arg) {
		case 'undefined': 
			return this.options.items;
			break;
		case 'object':
			if (Array.isArray (arg)) {
				console.log('foreach items changed');
				this.options.items=arg;
				db.save(this.options);
				this.refresh();
				if (typeof callback=='function') {
					for (var i=0; i<this.options.items.length; i++){
						//pass arguments: index, element
						callback(i, this.element.children(':nth-child('+ (i+1) +')'));
					}
				}
			} 			
			break;
		case 'string':
			if (arg=='max' || arg=='count'){
				var r=0;
				this.options.items.forEach(function(i){r=(r<i)?i:r;});
				return r;
			}
			break;
		}
	},
	
	
    refresh: function() {
		var action, all, el, i, j;
		var newbies=-1; //number elements in template to be determined
		this.element.html(''); //clean slate
		for (i in this.options.items){
			this.index=i;
			this.index1=parseInt(i)+1;
			this.item=this.options.items[i];
			this.element.append(this.template);
			all=$(this.element).find('*');
			if (newbies == -1) newbies=all.length; 
			for (j=newbies;  j>0;  j--){
				this.child=all[ all.length-j ];
				el=all[ all.length-j ];
				action=$(el).attr('soup-action');
				//console.log(action);
				//What about nested foreach's
				el.foreach=this;
				//el[this.name]=this; //to allow nested foreach
				el.index=this.index;
				el.foreachIndex=this.index;
				//el[this.name+'Index']=this.index; //to allow nested foreach
				el.foreachIndex1=this.index1;
				//el[this.name+'Index1']=this.index1; //to allow nested foreach
				el.foreachItem=this.item;
				//el[this.name+'Item']=this.item; //to allow nested foreach
				if (action) {
					try { eval( action ); } 
					catch(er) { console.log( er );}
				}
			}
			this._trigger("foreach-refresh", null, {'foreach':this} );
		};
   },


}); //widget


//TO DO make foreach nestable

//apply foreach widgets to elements containing the soup-foreach tag 
//<div   class='something' soup-foreach>
var foreach=function(){$('[soup-foreach]').foreach(); return soup;}

return foreach;

}); //define


