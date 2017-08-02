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

var soup={};
var $=require('jquery');
var $$=require('jquery-ui');

//////////////////////////////////////////////////////
// contextMenu

$.widget("soup.contextMenu", {

	hi:function(){alert('hello');},
	
	options:{	},
	
	_create: function(){
		$(this.element).hide();
		this.options.caller=null; //caller set by show()
	},
	
	caller:function( ){
		var  r=this.options.caller;
		if (arguments[0]=='foreach') {
			//r=$.data(this.options.caller,'foreach');
			r=this.options.caller.foreach;
		}
		else if (arguments[0]=='foreachItem') {
			//r=$.data(this.options.caller,'foreachItem');
			r=this.options.caller.foreachItem;			
		}
		else if (arguments[0]=='foreachIndex') {
			//r=$.data(this.options.caller,'foreachIndex');
			r=this.options.caller.foreachIndex;
		}
		else if (arguments[0]=='foreachIndex1') {
			//r=$.data(this.options.caller,'foreachIndex');
			r=this.options.caller.foreachIndex1;
		}
		return r;
	},
	
	_destroy: function() {
        //this.element.removeClass( "savable" ).text( "" );
    },
	
	hide:function(){
		$(this.element).hide();
	},

    _setOption: function( key, valu ) {
       //if ( key === "valu" ) { valu = this._checkValu( valu );  }
       this._super( key, valu );
	},
	
	_setOptions: function( options ) { this._super( options );  },

	show: function(ev){
		//elmenu=$(elmenu);
		//soup.popdn=function(){ elmenu.hide(); }
		//soup._popcaller=caller;
		this.options.caller=ev.target;
		var left = ev.pageX + 5;
		var top = ev.pageY;
		if (top + this.element.height() >= $(window).height()) top -= this.element.height();
		if (left + this.element.width() >= $(window).width()) left -= this.element.width();
		this.element.show().css({zIndex:1001, left:left, top:top});
		return false;
	}
	
});


return null;

}); //define


