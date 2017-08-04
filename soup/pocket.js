/**********************************
S imple
O ff-line
U tility
P ackage

Andrew Siddeley
19-Apr-2016
02-Aug-2017
*/

// Define a Module with Simplified CommonJS Wrapper...
// see http://requirejs.org/docs/api.html#cjsmodule
define( function(require, exports, module) {

var $=require('jquery');
var $$=require('jquery-ui');

/////////////////////////////////////////////////////////
//
// pocket
soup.pocket=function(el){
	$(el).pocket();
	return soup;
};


$.widget("soup.pocket", {

	_template:'<div></div>',
	_imgpath:'',
	
	options:{
		name:'unnamed',
		file:{name:null},
		caption:'unnamed'
	},
	
	_create: function(){
		//this.options.caller=null;
		//this._template=this.element.html();
		this._imgpath=this.element.attr('soup-imgpath');
		this.options=$.extend(this.options,{
			name:this.element.attr('id')
		});

		this._on( this.element, {
			dragover:'_dragover',
			drop:'_dropimg'
		});
		this.options=$.extend(this.options, soup.dataLoad(this.options));
		this.refresh();
	},
	
	_dragover:function(event){
		//event.originalEvent.dataTransfer.effectAllowed = "link";
		//this.element.css(background,'pink');
	},


	_dropimg:function(event){
		//just get first file
		for (var p in event.originalEvent.dataTransfer.files[0]){
			console.log(p+':'+event.originalEvent.dataTransfer.files[0][p]);
		}
		this.options.file.name=event.originalEvent.dataTransfer.files[0].name;
		soup.dataSave(this.options);
		this.refresh();
	},
	
	_destroy: function() {
        //this.element.removeClass( "savable" ).text( "" );
    },
	
	refresh: function(){
		var s=(this.options.file.name!=null)?('src="./'+this._imgpath+this.options.file.name+'"'):' ';
		this.element.html('<img '+ s +' style="max-width:100%; max-height:100%;" >');
		//this.element.html('<img '+ s + '>');
		//console.log(this.element.html());
	},
	
	result: function(){return this._imgpath+this.options.file.name;},
	
    _setOption: function( key, valu ) {
       //if ( key === "valu" ) { valu = this._checkValu( valu );  }
       this._super( key, valu );
	},
	
	_setOptions: function( options ) { this._super( options );  },
	
});

console.log("pocket loaded");

return null;

}); //define


