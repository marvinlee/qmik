(function(Q) {
	var intance;

	function Plug() {}
	//单例方法
	Plug.getInstance = function() {
		intance = intance || new Plug();
		return intance;
	}

	Q.extend(Plug.prototype, {
		showList: function() {
			var me=this;
			var qiframe = Q("#areaPlug iframe");
			if(qiframe.attr("_src")){
				qiframe[0].src=Q.url(qiframe.attr("_src"));
				me.show(Q("#areaPlug"));
			}
			
		},
		showHelp: function(plug) {
			var me=this;
			var qiframe = Q("#areaPlug iframe");
			if(qiframe.attr("_src")){
				qiframe[0].src=Q.url(qiframe.attr("_src"));
				me.pop(Q("#areaPlug"));
			}
		}
	});
	Q.define(function(require, exports, module) {
		var View = require("View");
		Q.inherit(Plug, View);
		intance = new Plug();
		module.exports = Plug;
	});
})($);