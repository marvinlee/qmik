/**
 * 首页家庭页面显示模块
 */
(function(Q, define) {
	define(function(require, exports, module) {
		var index = require("index");
		console.log(index);
		function exp(id) {
			index.showNav(id)
		}
		module.exports = exp
	})
})(Qmik, Qmik.sun.define);
