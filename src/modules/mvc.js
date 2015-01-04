/**
 * authur leochen
 * mvc模块
 */
(function(Q) {
	var win = Q.global,
		doc = win.document;

	var ctrls = {};

	var namespace = "qmik-mvc-space",
		mapValues = {};

	function Scope(parentScope) {
		var me = this;
		me.__watchs = {};
		if (parentScope) {
			var __parentScope = me.parentScope = parentScope;
			me.__defineSetter__("parentScope", function(v) {});
			me.__defineGetter__("parentScope", function() {
				return __parentScope
			});
		}
	}
	Q.extend(Scope.prototype, {
		watch: function(name, callback) {
			var me = this;
			me.__watchs[name] = me.__watchs[name] || [];
			me.__watchs[name].push(callback);
		}
	})

	function App() {
		var me = this;
		me.scope = new Scope();
		Q.delay(me.__init, me, 10);
	}

	Q.extend(App.prototype, {
		__init: function() {
			var me = this;
			me.scope = initScope();
			Q("html")[0][namespace] = me.scope;
			parser(Q("html")[0], me.scope);
			function change(e) {
				var target = e.target,
					name = target.name,
					scope = getNameSpace(target).$scope || me.scope;
				scope[name] = getInputValue(target, scope);
				Q.each(scope.__watchs[name], function(i, watch){
					watch && watch(getVarValue(scope, name));
				});
				replaceMap(name, scope);			
			}
			$("body").on({
				input: change,
				change: change
			});
		},
		ctrl: function(name, callback) {
			var me = this;
			ctrls[name] = callback;
			return me;
		}
	});

	/** 初始化并获取数据 */
	function initScope(context, parentScope) {
		var scope = new Scope(parentScope);
		$("input,select,textarea", context || doc).each(function(i, dom) {
			dom.name && (scope[dom.name] = getInputValue(dom, scope))
		});
		return scope;
	}

	function getInputValue(node, scope) {
		var name=node.name,
			vals = [];
		switch (node.type) {
			case "radio":
				vals[0] = node.checked ? node.value : "";
				break;
			case "checkbox":
				Q(getCtrl(node)).find("input[type=checkbox]").filter(function(i,dom){
					return dom.name == node.name
				}).each(function(i, dom){
					dom.checked && vals.push(dom.value)
				});
				break;
			case "select-multiple":
				Q.each(node.options, function(i, option){
					option.selected && vals.push(option.value)
				});
				break;
			default:
				vals.push(node.value);
				break;
		}
		return vals.join(",")
	}
	var REG_B = /(\$\{\s*[\w\._-]*\s*\})|(\{\{\s*[\w\._-]*\s*\}\})/g;

	function parser(dom, scope) {
			(function deal(node, ctrlScope) {
				if (!node || node === window) return;
				Q.each(node.childNodes, function(i, node) {
					replaceNodeVar(node, ctrlScope, deal);
				})
			})(dom, scope);
		}
		//取得变量名
	function getVarName(name) {
		return (name || "").replace(/\s*((^(\$|\{)\{)|(\}?\}$))\s*/g, "");
	}

	function getVarValue(scope, name) {
		return scope[name] || (scope.parentScope || {})[name] || "";
	}
	function getCtrl(node){
		return Q(node).closest("[q-ctrl],html")[0]
	}
	function getNameSpace(node){
		return Q(node).closest("[q-ctrl],html")[0][namespace]
	}

	function replaceMap(key, scope) {
		Q.each(mapValues[key], function(i, dom) {
			replaceNodeVar(dom, scope);
		});
	}

	function replaceNodeVar(node, scope, callback) {
		var space = node[namespace] = node[namespace] || {
			$scope: {}
		};
		switch (node.nodeType) {
			case 1:
				var attrs = node.attributes || [],
					i = 0,
					attr;
				for (; i < attrs.length; i++) {
					attr = attrs[i];
					var name = attr.name;
					var value = space[name] = space[name] || (attr.value || "").replace(/(\s){2,}/g, "");
					if ("q-ctrl" === name) {
						var ctrlScope = initScope(node, scope);
						space.$scope = ctrlScope;
						Q.execCatch(function() {
							ctrls[value] && ctrls[value](ctrlScope);
						});
						scope = ctrlScope;
					} else if ("q-for" === name) { //for
						var vs = value.split(" "),
							vals = getVarValue(scope, vs[2]) || [],
							template = node.innerHTML,
							htmls = [];
						Q.each(vals, function(i, item) {
							var html = template.replace(REG_B, function(varName) {
								var reg = new RegExp("^" + vs[0] + "\."),
									val,
									name = getVarName(varName);
								if (reg.test(name)) {
									name = name.replace(reg, "");
									val = item[name];
								} else {
									val = varName;
								}
								return val || "";
							});
							htmls.push(html);
						});
						node.innerHTML = htmls.join("");
						parser(node, scope);
					} else if (REG_B.test(value)) {
						value = value.replace(REG_B, function(name) {
							name = getVarName(name);
							var val = getVarValue(scope, name);
							if (callback) {
								mapValues[name] = mapValues[name] || [];
								mapValues[name].push(node);
							}
							return val;
						});
						attr.value = value;
					}
				}
				break;
			case 3:
				var val = space.text;
				val = Q.isNull(val) ? node.textContent : val;
				if (REG_B.test(val)) {
					space.text = val;
					node.textContent = val.replace(REG_B, function(name) {
						name = getVarName(name);
						var val = getVarValue(scope, name);
						if (callback) {
							mapValues[name] = mapValues[name] || [];
							mapValues[name].push(node);
						}
						return val;
					});

				}
				break;
		}
		callback && callback(node, scope);
	}
	var _app;

	function app() {
		if (!_app) {
			_app = new App();
		}
		return _app;
	}
	Q("body").hide();
	Q.delay(function() {
		Q("body").show();
	}, 10);
	Q.app = app;
})(Qmik);