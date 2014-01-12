(function(Q) {
	var intance;

	function Download() {}
	//单例方法
	Download.getInstance = function() {
		intance = intance || new Download();
		return intance;
	}

	Q.extend(Download.prototype, {
		showList: function() {
			var me=this;
			var qiframe = Q("#areaDownload iframe");
			if(qiframe.attr("_src")){
				qiframe[0].src=Q.url(qiframe.attr("_src"));
				me.show(Q("#areaDownload"));
			}
		}
	});
	Q.define(function(require, exports, module) {
		var View = require("View");
		Q.inherit(Download, View);
		intance = new Download();
		module.exports = Download;
	});
})($);