(function($) {
	var data = {
		list: [{
			name: "core",
			class: "am-nav-header",
			list: [{"name":"encode","url":"#core/encode"},{"name":"decode","url":"#core/decode"},{"name":"now","url":"#core/now"},{"name":"delay","url":"#core/delay"},{"name":"cycle","url":"#core/cycle"},{"name":"isDom","url":"#core/isDom"},{"name":"isBool","url":"#core/isBool"},{"name":"isString","url":"#core/isString"},{"name":"isFunction","url":"#core/isFunction"},{"name":"isNumber","url":"#core/isNumber"},{"name":"isArray","url":"#core/isArray"},{"name":"isNull","url":"#core/isNull"},{"name":"isError","url":"#core/isError"},{"name":"isEvent","url":"#core/isEvent"},{"name":"isDate","url":"#core/isDate"},{"name":"isObject","url":"#core/isObject"},{"name":"isPlainObject","url":"#core/isPlainObject"},{"name":"likeArray","url":"#core/likeArray"},{"name":"likeNull","url":"#core/likeNull"},{"name":"isIphone","url":"#core/isIphone"},{"name":"isWP","url":"#core/isWP"},{"name":"isIE","url":"#core/isIE"},{"name":"isFF","url":"#core/isFF"},{"name":"isWK","url":"#core/isWK"},{"name":"isOpera","url":"#core/isOpera"},{"name":"isRetinal","url":"#core/isRetinal"},{"name":"each","url":"#core/each"},{"name":"trim","url":"#core/trim"},{"name":"merge","url":"#core/merge"},{"name":"inArray","url":"#core/inArray"},{"name":"unique","url":"#core/unique"},{"name":"map","url":"#core/map"},{"name":"getScript","url":"#core/getScript"},{"name":"getCss","url":"#core/getCss"},{"name":"grep","url":"#core/grep"},{"name":"param","url":"#core/param"},{"name":"log","url":"#core/log"},{"name":"warn","url":"#core/warn"},{"name":"error","url":"#core/error"},{"name":"inherit","url":"#core/inherit"},{"name":"config","url":"#core/config"},{"name":"execCatch","url":"#core/execCatch"},{"name":"cssPrefix","url":"#core/cssPrefix"}]
		},{
			name: "query",
			class: "am-nav-header",
			list: [{"name":"last","url":"#core/last"},{"name":"eq","url":"#core/eq"},{"name":"first","url":"#core/first"},{"name":"filter","url":"#core/filter"},{"name":"even","url":"#core/even"},{"name":"odd","url":"#core/odd"},{"name":"gt","url":"#core/gt"},{"name":"lti","url":"#core/lti"},{"name":"find","url":"#core/find"},{"name":"each","url":"#core/each"},{"name":"append","url":"#core/append"},{"name":"appendTo","url":"#core/appendTo"},{"name":"remove","url":"#core/remove"},{"name":"before","url":"#core/before"},{"name":"after","url":"#core/after"},{"name":"beforeTo","url":"#core/beforeTo"},{"name":"afterTo","url":"#core/afterTo"},{"name":"html","url":"#core/html"},{"name":"empty","url":"#core/empty"},{"name":"text","url":"#core/text"},{"name":"addClass","url":"#core/addClass"},{"name":"rmClass","url":"#core/rmClass"},{"name":"show","url":"#core/show"},{"name":"hide","url":"#core/hide"},{"name":"animate","url":"#core/animate"},{"name":"toggle","url":"#core/toggle"},{"name":"map","url":"#core/map"},{"name":"css","url":"#core/css"},{"name":"attr","url":"#core/attr"},{"name":"rmAttr","url":"#core/rmAttr"},{"name":"data","url":"#core/data"},{"name":"rmData","url":"#core/rmData"},{"name":"val","url":"#core/val"},{"name":"next","url":"#core/next"},{"name":"prev","url":"#core/prev"},{"name":"clone","url":"#core/clone"},{"name":"hover","url":"#core/hover"},{"name":"hasClass","url":"#core/hasClass"},{"name":"closest","url":"#core/closest"},{"name":"parents","url":"#core/parents"},{"name":"parents","url":"#core/parents"},{"name":"children","url":"#core/children"}]
		},{
			name: "sun",
			class: "am-nav-header",
			list: [{"name":"define","url":"#core/define"},{"name":"use","url":"#core/use"},{"name":"config","url":"#core/config"},{"name":"require","url":"#core/require"}] 
		},{
			name: "mvc",
			class: "am-nav-header",
			list: [{"name":"app","url":"#core/app"},{"name":"ctrl","url":"#core/ctrl"},{"name":"scope","url":"#core/scope"}] 
		},{
			name: "ajax",
			class: "am-nav-header",
			list: [{"name":"ajax","url":"#core/ajax"},{"name":"get","url":"#core/get"},{"name":"getJSON","url":"#core/getJSON"},{"name":"post","url":"#core/post"}] 
		},{
			name: "event",
			class: "am-nav-header",
			list: [{"name":"on","url":"#core/on"},{"name":"off","url":"#core/off"},{"name":"live","url":"#core/live"},{"name":"die","url":"#core/die"},{"name":"once","url":"#core/once"}] 
		}]
	};
	//导出对象
	define(function() {
		return data;
	});
	//
})(Qmik);