(function(Q) {
	function QmikAPIBase() {};

	Q.define(function(require, exports, module) {
		//var BaseAct = require("BaseAct");
		var QmikAPI = require("QmikAPI");
		require("Qmik.fn.scoll");
		Q.inherit(QmikAPIBase, QmikAPI);
		module.exports = new QmikAPIBase();
	});
})($);