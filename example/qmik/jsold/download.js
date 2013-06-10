/**
 * 首页家庭页面显示模块
 */
(function(Q, define) {
	Q.log("get module download")
	define(function(require, exports, module) {
		var index = require("index");
		function exp(id) {
			Q.log("use module download;")
			Q("#head").css("background","#aaa456")
			index.showNav(id);
			Q(".panel").hide();
			Q("#download").show();
		}
		module.exports = exp
	})
})(Qmik, Qmik.sun.define);
