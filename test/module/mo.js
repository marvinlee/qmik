(function(Q){
	function mo() {
		//console.log("haha you big");
		Q("body").css({
			backgroundColor:"red"
		});
		return 10;
	}
	Q.sun.define("mo", function(require, exports, module) {
		
		module.exports = mo;
		return mo;
	});

})(Qmik);

