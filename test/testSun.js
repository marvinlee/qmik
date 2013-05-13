
Qmik.config("debug",true);
Qmik.config("error",{enable:true})
Qmik.sun.config( {
	alias : {
		'mo' : '/test/module/mo'
	}
});
Qmik.sun.define("ak", function(require, exports, module) {
	var v = require("mo");
	var b = require("mo");
	var c = require("mo");
	console.log("ak vvv mo:" + c+"--"+c());
	function log() {
		return 333;
	}
	module.exports=log
	return log;
});
$(document).ready(function(Q) {
	console.log("gogo")
	Qmik.sun.use("ak", function(ak) {
		console.log("use ak:" + ak + ":"+ak());
 
	})
});
function abc(){
	console.log("abc");
	throw new Error("eeee");
}

var d=$.box(abc); 
$.cycle(function(){
	try{
	d();
	}catch(e){}
},4000);
