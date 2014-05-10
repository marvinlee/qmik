console.log("fdfdfdf");
;(function(Q){
	Q.config("debug",true);
	Q.config("error",{enable:true})
	Q.sun.config( {
		alias : {
			'mo1' : '/test/module/mo1.js?v=${time}',
			'mo' : '/test/module/mo.js?v=${time}'
		},
		vars:{
			time:parseInt(Q.now()/3600000)
		}
	});
	Q.sun.define("ak", function(require, exports, module) {

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
	console.log(33);
	Q(document).ready(function() {
		Q("#bbq").on({
			click:function(e){
				Q.sun.use(["mo"], function(mo) {
					alert(mo());
				})
			}
		});
		console.log("==================");
		Q.sun.use(["ak","mo1","mo"], function(ak,mo1,mo) {
			console.log("use ak: value=:"+ak());
			console.log("use mo1:value:="+mo1());
			console.log("use mo:value:="+mo());
			Q.sun.use(["mo2"],function(mo2){
				console.log(mo2())
			});
		});
		Q.sun.use("mo1",function(mo1){
			console.log("==="+mo1());
		});
	});

})(Qmik);

