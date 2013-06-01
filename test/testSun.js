
Qmik.config("debug",true);
Qmik.config("error",{enable:true})
Qmik.sun.config( {
	alias : {
		'mo' : '/test/module/mo'
	}
});
Qmik.sun.define("ak", function(require, exports, module) {

	var d,k // ,c = require("mcco")//
	;
	/** 
	 * var    d=c = require("mcco")
	 * 
	 */
	//console.log("ak vvv mo:" + c+"--");
	function log() {
		return 333;
	}
	module.exports=log
	return log;
});
$(document).ready(function(Q) {
	Qmik.sun.use("ak", function(ak) {
		console.log("use ak:" + ak + ":"+ak());
 
	})
});
