/**
 * mvc模块
 * @author leoche
 */
(function(Q) {
	var win = Q.global,
		isNull = Q.isNull,
		isPlainObject = Q.isPlainObject,
		extend = Q.extend,
		each = Q.each,
		execCatch = Q.execCatch;

	var scopeParentScope ="parentScope";

	var ctrls = {}, //控制器存储
		scopes = {},
		isExecApply = true; 
	var namespace = "qmik-mvc-space",
		namespaceScope = "qmik-mvc-space-scope",
		scopeWathcs = "__watchs",
		nameRoot = "html",
		nameContext = "__context";
	/** 应用 */
	function App(fun) {
		var me = this;
		Q(function(){
			me.__init(fun);
		})
	}
	extend(App.prototype, {
		__init: function(fun) {
			var me = this;
			var scope = new Scope();
			me.scope =Q(nameRoot)[0][namespace] = scope;
			fun && fun(scope);
			compile(Q(nameRoot)[0], scope, true);//编译页面
			isExecApply = false;
			function change(e) {
				var target = e.target,
					name = target.name,
					tagName = target.tagName,
					scope = getCtrlNode(target)[namespaceScope] || scope;
				if (tagName == "INPUT" || tagName == "SELECT" || tagName == "TEXTAREA") {
					scope[name] = getInputValue(target, scope);
					each(scope[scopeWathcs][name], function(i, watch) {
						watch && watch(getVarValue(scope, name));
					});
					compileVarName(name, scope);
				}
			}
			function remove(e){
				var target = e.target,
					name = target.name,
					isInput = target.tagName == "INPUT",
					space = getSpace(target),
					scope = space.scope = space.scope;
				each(space.vars, function(i, _name) {
					var newmaps = [];
					if (isInput && name == _name) {
						return;
					}
					each(scope.__map[_name], function(i, dom) {
						dom != target && newmaps.push(dom);
					});
					scope.__map[_name] = newmaps;
				});
				if(isInput){
					delete scope.__map[name];
					delete scope.__input[name];
				}
			}
			Q("body").on({
				change: change,
				keyup: change
			});
			Q(document).on({
				//DOMSubtreeModified: function(e){},
				DOMNodeInserted: function(e){//节点增加
					Q.delay(function(){
						var target = e.target,
						space = getSpace(target);
						compile(target, space.scope);
					}, 100);					
				},
				DOMNodeRemoved: remove //删除节点
			});
		},
		//控制器
		ctrl: function(name, callback) {
			if (isPlainObject(name)) {
				extend(ctrls, name)
			} else {
				ctrls[name] = callback;
			}
			return this;
		}
	});
/** 会话 */
	function Scope(context, parentScope) {
		var me = this;
		me[scopeWathcs] = {}; //监听器集合
		me[nameContext] = context = context || Q(nameRoot)[0]; //上文dom节点
		me.__name = Q(context).attr("q-ctrl") || "root"; //控制器名
		me.__map = {}; //变量映射节点集合
		me.__cmd = {};
		me.__input = {};
		me.scopes = scopes;
		scopes[me.__name] = me;
		context[namespaceScope] = me;
		me[scopeParentScope] = parentScope; //父scope
		$("input,select,textarea", context).each(function(i, dom) {
			var name = dom.name, isSet=true;
			if(name && name != scopeParentScope){
				if(me.__name == "root" && Q(dom).parents("[q-ctrl]").length>0){
					isSet = false;
				}
				if(isSet){
					me[name] = getInputValue(dom, me);
					me.__input[name] = dom;
				}
			}
		});
	}
	extend(Scope.prototype, {
		// 监控器,监控变量
		watch: function(name, callback) {
			var me = this, map = {};
			if (isPlainObject(name)) {
				map = name;				
			}else{
				map[name] = callback;
			}
			each(map, function(name, value){
				me[scopeWathcs][name] = me[scopeWathcs][name] || [];
				me[scopeWathcs][name].push(value);
			});			
			return me;
		},
		//验证,验证会调用指令器来检测数据,最终所有数据都符合条件才会返回true,否则返回false
		check: function() {
			var me = this;
		},
		apply: function(names) { //应用会话信息的变更,同时刷新局部页面
			var me = this;
			if(isExecApply == false){
				isExecApply = true;
				execCatch(function(){
					if (names) {
						names = Q.isArray(names) ? names : [names];
						each(names, function(i, name) {
							compileVarName(name, me)
						});
					} else {
						compile(me[nameContext], me)
					}
				});				
				isExecApply = false;
			}
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
			Q("input[name='"+node.name+"']", getCtrlNode(node)).each(function(i, dom){
				dom.checked && vals.push(dom.value)
			})
		}else if(type == "select-multiple"){
			each(node.options, function(i, option) {
				option && option.selected && vals.push(option.value)
			})
		}else {
			vals.push(node.value)
		}
		return vals.join(",")
	}
	var REG_B = /(\$\{\s*[\w\._-]*\s*\})|(\{\{\s*[\w\._-]*\s*\}\})/g;

	/** 解析页面 */
	function compile(node, scope, isAdd) {
		(function deal(node, ctrlScope) {
			if (!node || node === win) return;
			each(node.childNodes, function(i, node) {
				replaceNodeVar(node, ctrlScope, isAdd, deal);
			})
		})(node, scope);
	}
	//取得变量名
	function getVarName(name) {
		return (name || "").replace(/\s*((^(\$|\{)\{)|(\}?\}$))\s*/g, "");
	}
	function getValue(object, name){
		var ns = name.split(".");
		for(var i=0;i<ns.length;i++){
			if(isNull(object))return "";
			object = object[ns[i]]
		}
		return object;
	}
	//取变量对应的值
	function getVarValue(scope, name) {
		var useScope = isNull(scope[name]) ? scope[scopeParentScope] : scope,
			//val = (useScope || {})[name];
			val = getValue(useScope, name);
		return isNull(val) ? "" : val;
	}
	/** 取控制器节点 */
	function getCtrlNode(node) {
		return Q(node).closest("[q-ctrl],"+nameRoot)[0]
	}

	//添加变量映射节点
	function addMapNode(scope, name, node) {
		var useScope = isNull(scope[name]) ? scope[scopeParentScope] : scope;
		if (useScope) {
			useScope.__map[name] = useScope.__map[name] || [];
			useScope.__map[name].push(node);
		}
	}

	function compileVarName(key, scope) {
		each(scope.__map[key], function(i, dom) {
			replaceNodeVar(dom, scope);
		});
	}
	/** 取存放到节点上的对象空间 */
	function getSpace(node){
		var ctrl = getCtrlNode(node);
		node[namespace] = node[namespace] || {
			attr: {},
			vars: [],
			ctrl: ctrl,
			event: {},
			scope: ctrl.scope
		};
		return node[namespace];
	}
	function replaceNodeVar(node, scope, isAdd, callback) {
		var space = getSpace(node);
		switch (node.nodeType) {
			case 1://正常节点
				var attrs = node.attributes || [],
					i = 0;
				for (; i < attrs.length; i++) {
					var attr = attrs[i],
						attrName = attr.name.trim(),//属性名
						value = space.attr[attrName] = space.attr[attrName] || (attr.value || "").trim().replace(/(\s){2,}/g, " ");
					if ("q-ctrl" === attrName) {//控制器
						if (value != "") {
							scope = new Scope(node, scope);
							execCatch(function() {
								Q.isFun(ctrls[value]) ? ctrls[value](scope) : Q.warn("q-ctrl:[" + value + "]is not define");
							});
						}
					} else if ("q-for" === attrName) { //for
						var vs = value.split(" "),
							template = space.html = space.html || node.innerHTML,
							htmls = [];
						each(getVarValue(scope, vs[2]) || [], function(i, item) {
							var html = template.replace(REG_B, function(varName) {
								var reg = new RegExp("^" + vs[0] + "\."),
									name = getVarName(varName).replace(reg, ""),
									val = getValue(item, name);
								return val || "";
							});
							htmls.push(html);
						});
						node.innerHTML = htmls.join("");
						compile(node, scope);
					} else if(/^q-on/.test(attrName)){//事件绑定
						var onName = attrName,
							name = attrName.replace(/^q-on/,""),
							funName = value.replace(/\(.*\)$/,"");
						if(!space.event[name]){
							space.event[name] = true;
							var handle = function(e){
								if(!Q.contains(scope[nameContext], node)){
									return Q(scope[nameContext]).off(name, handle);
								}
								if( Q.contains(node, e.target) ){//判断是否是当前节点的子节点触发的事件
									scope[funName] && scope[funName](e);
								}			
							}
							Q(scope[nameContext]).on(name, handle);
						}						
					} else if (REG_B.test(value)) {//变量
						value = value.replace(REG_B, function(name) {
							name = getVarName(name);
							space.vars.push(name);
							var val = getVarValue(scope, name);
							isAdd && addMapNode(scope, name, node);							
							return val;
						});
						attr.value = value;
					}
				}
				break;
			case 3://文本节点
				var val = space.text;
				val = isNull(val) ? node.textContent : val;
				if (REG_B.test(val)) {
					space.text = val;
					node.textContent = val.replace(REG_B, function(name) {
						name = getVarName(name);
						space.vars.push(name);
						var val = getVarValue(scope, name);
						isAdd && addMapNode(scope, name, node);
						if(scope.__input[name] && scope.__input[name].value!=val){
							scope.__input[name].value = val;
						}
						return val;
					});
				}
				break;
		}
		space.scope = scope;
		callback && callback(node, scope);
	}

	var _app;

	function app(fun) {
		if (!_app) {
			_app = new App(fun);
		}
		return _app;
	}
	Q.app = app;
})(Qmik);