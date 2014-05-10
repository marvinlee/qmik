(function(Q){
	function mo() {
		//console.log("haha you big");
		return 10;
	}
	Q.sun.define("mo1", function(require, exports, module) {
		
		module.exports = mo;
		return mo;
	});
	Q.sun.define("mo1", function(require, exports, module) {
		
		module.exports = function(){
			return Q.now()+"";
		};
		return mo;
	});
	Q.sun.define("mo2", function(require, exports, module) {
		
		module.exports = function(){
			return "mo2_"+Q.now();
		};
		return mo;
	});
	Q.sun.define("mo3", function(require, exports, module) {
		
		module.exports = function(){
			return "mo2_"+Q.now();
		};
		return mo;
	});
})(Qmik);

