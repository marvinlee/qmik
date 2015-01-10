(function() {
	var Module = {
		init: function(scope){
			scope.cores = initCores();
			scope.modules = initModules();
			scope.mvcs = initMvcs();
			scope.querys = initQuerys();
			scope.ajaxs = initAjaxs();
			scope.events = initEvents();
			scope.apply();
		}
	};

	function initCores(){
		var list = [
			{"name":"encode"},
			{"name":"decode"},
			{"name":"now"},
			{"name":"delay"},
			{"name":"cycle"},
			{"name":"isDom"},
			{"name":"isBool"},
			{"name":"isString"},
			{"name":"isFunction"},
			{"name":"isNumber"},
			{"name":"isArray"},
			{"name":"isNull"},
			{"name":"isError"},
			{"name":"isEvent"},
			{"name":"isDate"},
			{"name":"isObject"},
			{"name":"isPlainObject"},
			{"name":"likeArray"},
			{"name":"likeNull"},
			{"name":"isIphone"},
			{"name":"isWP"},
			{"name":"isIE"},
			{"name":"isFF"},
			{"name":"isWK"},
			{"name":"isOpera"},
			{"name":"isRetinal"},
			{"name":"each"},
			{"name":"trim"},
			{"name":"toLower"},
			{"name":"toUpper"},
			{"name":"merge"},
			{"name":"inArray"},
			{"name":"unique"},
			{"name":"map"},
			{"name":"getScript"},
			{"name":"getCss"},
			{"name":"grep"},
			{"name":"param"},
			{"name":"log"},
			{"name":"warn"},
			{"name":"error"},
			{"name":"stringify"},
			{"name":"parseJSON"},			
			{"name":"inherit"},
			{"name":"config"},
			{"name":"execCatch"},
			{"name":"cssPrefix"}
		];
		return list;
	}
	function initModules(){
		var list = [
			{"name":"define"},
			{"name":"use"},
			{"name":"config"},
			{"name":"require"}
		];
		return list;
	}
	function initMvcs(){
		var list = [
			{"name":"app"},
			{"name":"ctrl"},
			{"name":"scope"}
		];
		return list;
	}
	function initQuerys(){
		var list = [
			{"name":"last"},
			{"name":"eq"},
			{"name":"first"},
			{"name":"filter"},
			{"name":"even"},
			{"name":"odd"},
			{"name":"gt"},
			{"name":"lti"},
			{"name":"find"},
			{"name":"each"},
			{"name":"append"},
			{"name":"appendTo"},
			{"name":"remove"},
			{"name":"before"},
			{"name":"after"},
			{"name":"beforeTo"},
			{"name":"afterTo"},
			{"name":"html"},
			{"name":"empty"},
			{"name":"text"},
			{"name":"addClass"},
			{"name":"rmClass"},
			{"name":"show"},
			{"name":"hide"},
			{"name":"animate"},
			{"name":"toggle"},
			{"name":"toggleClass"},
			{"name":"map"},
			{"name":"css"},
			{"name":"attr"},
			{"name":"rmAttr"},
			{"name":"data"},
			{"name":"rmData"},
			{"name":"val"},
			{"name":"next"},
			{"name":"prev"},
			{"name":"clone"},
			{"name":"hover"},
			{"name":"hasClass"},
			{"name":"closest"},
			{"name":"parents"},
			{"name":"parents"},
			{"name":"children"}
		];
		return list;
	}
	function initAjaxs(){
		var list = [
			{"name":"ajax"},
			{"name":"get"},
			{"name":"getJSON"},
			{"name":"post"}
		];
		return list;
	}
	function initEvents(){
		var list = [
			{"name":"on"},
			{"name":"off"},
			{"name":"live"},
			{"name":"die"},
			{"name":"once"}
		];
		return list;
	}
	define(function(require, exports, module) {
		return Module;
	});
})();