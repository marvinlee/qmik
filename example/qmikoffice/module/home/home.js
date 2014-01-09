(function(Q) {
	function Home() {
	}
	Q.extend(Home.prototype,{
		initView:function(){
			this.log("exec home initView");
		}
	});
	Q.define(function(require, exports, module) {
		var BaseAct = require("BaseAct");
		Q.inherit(Home, BaseAct);
		module.exports=new Home();
	});
})($);