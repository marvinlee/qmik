/**
 * mvc模块
 * @author leoche
 */
(function(Q) {
	var win = Q.global;

	var ctrls = {}, //控制器存储 
		cmds = { //指令器存储
			required: function(val) { //use required
				return Q.isNull(val) || /^\s*$/.test(val)
			},
			checkNumber: function(val) { //use check-number
				return /^\s*\d*\s*$/.test(val)
			},
			checkDouble: function(val) { //use check-double
				return /^\s*[\d\.]*\s*$/.test(val)
			},
			checkDomain: function(val) { //use check-domain
				return /^\s*([\w\u4e00-\u9fa5][\w\u4e00-\u9fa5-]*[\w\u4e00-\u9fa5]\.)+([\w\u4e00-\u9fa5]+)\s*$/.test(val)
			},
			checkIp: function(val) { //use check-ip
				return /^\s*(\d{1,3}\.){3}\d{1,3}\s*$/.test(val)
			},
			checkEmail: function(val) { //use check-email
				return /^\s*[\w\u4e00-\u9fa5][\w\u4e00-\u9fa5-]*[\w\u4e00-\u9fa5]@[\w\u4e00-\u9fa5]+\.[\w\u4e00-\u9fa5]+\s*$/.test(val)
			}
		};

	var namespace = "qmik-mvc-space",
		namespaceScope = "qmik-mvc-space-scope";
	/** 会话 */
	function Scope(context, parentScope) {
		var me = this;
		me.__watchs = {}; //监听器集合
		me.__context = context = context || Q("html")[0]; //上文dom节点
		me.__name = context ? Q(context).attr("q-ctrl") : "root"; //控制器名
		me.__map = {}; //变量映射节点集合
		context[namespaceScope] = me;
		me.parentScope = parentScope; //父scope
		$("input,select,textarea", context).each(function(i, dom) {
			dom.name && (me[dom.name] = getInputValue(dom, me))
		});
	}
	Q.extend(Scope.prototype, {
		// 监控器,监控变量
		watch: function(name, callback) {
			var me = this;
			me.__watchs[name] = me.__watchs[name] || [];
			me.__watchs[name].push(callback)
		},
		//验证,验证会调用指令器来检测数据,最终所有数据都符合条件才会返回true,否则返回false
		check: function() {

		},
		apply: function() { //应用会话信息的变更,同时刷新局部页面
			compile(this.__context, this)
		}
	})
	/** 应用 */
	function App() {
		var me = this;
		me.scope = new Scope();
		Q.delay(me.__init, me, 10);
	}

	Q.extend(App.prototype, {
		__init: function() {
			var me = this;
			me.scope = new Scope();
			Q("html")[0][namespace] = me.scope;
			compile(Q("html")[0], me.scope);//编译页面
			function change(e) {
				var target = e.target,
					name = target.name,
					tagName = target.tagName,
					scope = getCtrl(target)[namespaceScope] || me.scope;
				if (tagName == "INPUT" || tagName == "SELECT" || tagName == "TEXTAREA") {
					scope[name] = getInputValue(target, scope);
					Q.each(scope.__watchs[name], function(i, watch) {
						watch && watch(getVarValue(scope, name));
					});
					replaceMap(name, scope);
				}
			}
			Q("body").on({
				change: change,
				keyup: change
			});
		},
		//控制器
		ctrl: function(name, callback) {
			if (Q.isPlainObject(name)) {
				Q.extend(ctrls, name)
			} else {
				ctrls[name] = callback;
			}
			return this;
		},
		//指令器
		cmd: function(name, callback) {
			var me = this;
			if (Q.isPlainObject(name)) {
				Q.extend(cmds, name)
			} else {
				cmds[name] = callback;
			}
			return me;
		}
	});

	/** 取界面上input输入标签的初始化值 */
	function getInputValue(node, scope) {
		var name = node.name,
			type = node.type,
			vals = [];
		if(type == "radio"){
			vals[0] = node.checked ? node.value : ""
		}else if(type == "checkbox"){
			Q("input[name='"+node.name+"']", getCtrl(node)).each(function(i, dom){
				dom.checked && vals.push(dom.value)
			})
		}else if(type == "select-multiple"){
			Q.each(node.options, function(i, option) {
				option && option.selected && vals.push(option.value)
			})
		}else {
			vals.push(node.value)
		}
		return vals.join(",")
	}
	var REG_B = /(\$\{\s*[\w\._-]*\s*\})|(\{\{\s*[\w\._-]*\s*\}\})/g;

	/** 解析页面 */
	function compile(node, scope) {
		(function deal(node, ctrlScope) {
			if (!node || node === win) return;
			Q.each(node.childNodes, function(i, node) {
				replaceNodeVar(node, ctrlScope, deal);
			})
		})(node, scope);
	}
	//取得变量名
	function getVarName(name) {
		return (name || "").replace(/\s*((^(\$|\{)\{)|(\}?\}$))\s*/g, "");
	}
	//取变量对应的值
	function getVarValue(scope, name) {
		var useScope = Q.isNull(scope[name]) ? scope.parentScope : scope;
		return (useScope||{})[name]||""
	}

	function getCtrl(node) {
		return Q(node).closest("[q-ctrl],html")[0]
	}

	//添加变量映射节点
	function addMapNode(scope, name, node) {
		var useScope = Q.isNull(scope[name]) ? scope.parentScope : scope;
		if (useScope) {
			useScope.__map[name] = useScope.__map[name] || [];
			useScope.__map[name].push(node);
		}
	}

	function replaceMap(key, scope) {
		Q.each(scope.__map[key], function(i, dom) {
			replaceNodeVar(dom, scope);
		});
	}

	function replaceNodeVar(node, scope, callback) {
		var space = node[namespace] = node[namespace] || {};
		switch (node.nodeType) {
			case 1://正常节点
				var attrs = node.attributes || [],
					i = 0,
					attr,
					name,
					value;
				for (; i < attrs.length; i++) {
					attr = attrs[i];
					name = attr.name;
					value = space[name] = space[name] || (attr.value || "").trim().replace(/(\s){2,}/g, " ");
					if ("q-ctrl" === name) {
						if (value != "") {
							scope = new Scope(node, scope);
							Q.execCatch(function() {
								Q.isFun(ctrls[value]) ? ctrls[value](scope) : Q.warn("q-ctrl:[" + value + "]is not define");
							});
						}
					} else if ("q-for" === name) { //for
						var vs = value.split(" "),
							template = space["innerHTML"] = space["innerHTML"] || node.innerHTML,
							htmls = [];
						Q.each(getVarValue(scope, vs[2]) || [], function(i, item) {
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
						compile(node, scope);
					} else if (REG_B.test(value)) {
						value = value.replace(REG_B, function(name) {
							name = getVarName(name);
							var val = getVarValue(scope, name);
							if (callback) {
								addMapNode(scope, name, node);
							}
							return val;
						});
						attr.value = value;
					}
				}
				break;
			case 3://文本节点
				var val = space.text;
				val = Q.isNull(val) ? node.textContent : val;
				if (REG_B.test(val)) {
					space.text = val;
					node.textContent = val.replace(REG_B, function(name) {
						name = getVarName(name);
						var val = getVarValue(scope, name);
						if (callback) {
							addMapNode(scope, name, node);
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
	Q(function() {
		Q("body").hide();
		Q.delay(function() {
			Q("body").show();
		}, 10);
	});
	Q.app = app;
})(Qmik);