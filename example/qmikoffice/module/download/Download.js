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
			this.push();
			Q("#sheets [mid=show] [view=main]").hide();
			Q("#sheets [mid=show] [mid=download]").show();
			Q.get('module/download/download.html', function(txt) {
				txt = txt.replace(/\r|\n/g, "");
				Q("#sheets [mid=show] [mid=download]").html(txt);
				Q("#mDownload a").each(function(index,dom){
					dom.href=Q.url(Q(dom).attr("_href"));
				});
			});
			
		}
	});
	Q.define(function(require, exports, module) {
		var BaseAct = require("BaseAct");
		require("Qmik.fn.scrollBar");
		Q.inherit(Download, BaseAct);
		intance = new Download();
		module.exports = Download;
	});
})($);