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
			//area_attach
			//me.pop(Q("#area_plug"));
			me.popAttach();
		},
		showHelp: function(plug) {
			var me=this;
			//me.pop(Q("#area_plug"));
			me.popAttach();
		}
	});
	Q.define(function(require, exports, module) {
		var BaseAct = require("BaseAct");
		Q.inherit(Plug, BaseAct);
		intance = new Plug();
		module.exports = Plug;
	});
})($);