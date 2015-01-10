(function() {
	var context = $.config().context;
	var Module = {
		init: function(scope){
			initCore(scope);
		}
	};

	function initCore(scope){
		var ifa = document.createElement("iframe");
		ifa.src = context+"data/core.json";
		ifa.width = "100%";
		$("body .main").append(ifa);
	}
	define(function(require, exports, module) {
		return Module;
	});
})();