/**********************************
S imple
O pen
U tility
P ackage

Andrew Siddeley

19-Apr-2016
01-Aug-2017
********************************/


// Define a Module with Simplified CommonJS Wrapper...
// see http://requirejs.org/docs/api.html#cjsmodule
define(function(require, exports, module){

var $=require('jquery');
var $$=require('jquery-ui');
var db=require('soup/database');
//console.log('cell - keys of module.exports...', Object.keys(module.exports));


///////////////////////////////////////////////////////
// CELL
// Made with jQuery widget plug-in
// $('.cell').savable();
//
// NOTE: DO NOT USE '-' FOR ID NAMES, CELL WONT WORK.  USE '_' INSTEAD
// NOTE: Cell Ids cannot be Kebab-case, use snake_case or camelCase instead 

var cell=function(el){
	/**********
	Turns the provided element into a cell, I.e. savable and editable
	A cell has normally hidden heading and input fields as well as a normally showing result field.
	Cell text can be edited when the mouse is over it,
	*********/
	$(el).cell();
	return soup;
};


$.widget ("soup.cell", {
	
    options: {
		name: 'unnamed',
		text: 'default',
		xtxt: 'default', //existing text
		undo: [],
		idi: 'default',
		idr: 'default',
		idn: 'default'
	},
	
		_create:function() {
		this.options.name=this.element.attr("id");
		this.options.text=this.element.text();
		this.options.idi=this.options.name+'input';
		this.options.idr=this.options.name+'result';
		this.options.idn=this.options.name+'name';
		this.options=$.extend(this.options, db.load(this.options));
		//this.styleRestore();		
		this._on( this.element, {
			dragstop:'stylingStop',
			resizestop:'stylingStop',
			mouseenter:'_highlight', 
			mouseleave:'_highlightoff' ,
			contextmenu:'_contextmenu'
			//click:'_contentEdit'
		});
		this.render();
    },
	

	_contextmenu:function(event) {
		//var c=window.getComputedStyle(this.element[0],null);
		//var c=this.element.data("ui-draggable"); //long running script
		//$("#dialog").dialog('open').html(soup.anything(c));
		//return false;
		//alert('Cell context menu');
		return false; //cancel other context menus
	},
	
	_destroy: function() {
        //this.element.removeClass( "savable" ).text( "" );
    },
	
	_highlight:function(event) {
		//this.element.css('background-color','silver'); 
		this.options.xtxt=$("#" + this.options.idi).val();
		//$("#"+this.options.idn).show();
		$("#"+this.options.idi).show().css({'position':'relative', 'z-index':10000, 'background':'silver'});
		$("#"+this.options.idr).hide();	
	},
	
	_highlightoff:function(event) {
		//this.element.css('background-color','white'); 
		var ntxt=$("#" + this.options.idi).val();
		//text has changed so 
		if( ntxt != this.options.xtxt) {
			//text changed so save
			ntxt=(ntxt=='')?'--':ntxt;
			this.options.undo.push(this.options.xtxt);
			if (this.options.undo.length > 10) {this.options.undo.shift();}
			this.options.text=ntxt;
			$("#"+this.options.idr).text(this._process(ntxt));	
			soup.dataSave(this.options);
		}
		//$("#"+this.options.idn).hide();
		$("#"+this.options.idi).hide();
		$("#"+this.options.idr).show();	
	},
	
	
	_process: function( valu ) {
		//check for and evaluate code in cell content
		if (valu.substr(0,1) == '=') {
			try{valu=eval(valu.substr(1));}
			catch(er){valu=er.toString();}
		}
        return valu;
    },
	
	render: function() {		
		//wrap text so it can be saved & edited
		//console.log('cell foreachItem:'+this.element.foreachItem); //undefined
		this.element.html(
			"<p id='"+ this.options.idn + "' style='display:none;' >"+ this.options.name +"</p>"+
			"<textarea id='"+this.options.idi+"' type='text' style='z-index=10001; "+
			"display:none;width:100%;height:auto;'"+
			"onclick='soup.autoHeight(this)' onkeyup='soup.autoHeight(this)' >"+
			this.options.text+
			"</textarea>"+
			"<p id='"+this.options.idr+"' class='cellresult'>"+
			this._process(this.options.text)+
			"</p>"	
		);
		//this._trigger( "refreshed", null, { text: this.options.text } );
    },
	
	result: function(){
		return this._process(this.options.text);
	},
	
    _setOption: function( key, valu ) {
       //if ( key === "valu" ) { valu = this._checkValu( valu );  }
       this._super( key, valu );
	},
	
	_setOptions: function( options ) {
        this._super( options );
    },	
	
	
	styleGet:function(c){
		//return an object with only drag properties from a given object
		return	$.extend( { }, 
			{ 'position': c['position'] },
			{ 'left': c['left'] },
			//{ 'right': c['right'] },
			{ 'top': c['top'] },
			//{ 'bottom': c['bottom'] },
			{ 'height': c['height'] },
			{ 'width': c['width'] }
		);	
	},
	
	styleRestore:function(c){
		this.element.css(this.styleGet(this.options));
	},			
		
	stylingStop:function(event, ui){
		//save position
		var c=window.getComputedStyle(this.element[0],null);
		this.options=$.extend(this.options, this.styleGet(c));
		//console.log (soup.anything(this.options));
		soup.dataSave(this.options);
		//return false;
	}

});

//apply widgets to elements of certain class

//to make foreach nestable, apply foreach widget in reverse order ie. bottom to top of selection

$(document).ready(function(){	$(".soup-cell").cell();});

return cell;

}); //define



