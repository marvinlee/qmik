
/**
 * mvc模块
 * @author leochen
 */
(function(Q) {
	var win = Q.global,
		isNull = Q.isNull,
		isPlainObject = Q.isPlainObject,
		extend = Q.extend,
		each = Q.each,
		delay = Q.delay,
		execCatch = Q.execCatch;

	var ctrls = {}, //控制器存储
		scopes = {},
		g_config = {
			section: 24//q-for分隔大小
		},
		keywords = "scopes context parent get set on off once app";//关键词,用户不能定义到scope上的变量名
	var nameParentScope ="parent",
		namespace = "qmik-mvc-space",
		namespaceScope = "qmik-mvc-space-scope",
		fieldWatchs = "__watchs",
		nameRoot = "html",
		nameContext = "context",
		nameInput = "__input",
		nameMap = "__map",
		execInterval = 30;//scroll触发间隔
	/********* 当节点在显示视口时触发 start *******/
	var g_viewports = {};
	
	var prevTime = Q.now();
	function handle(e){
		var curTime = Q.now(), timeout = 10;
		if (curTime - prevTime < execInterval) {//触发频率
			return;
		}
		prevTime = curTime;
		var map = extend({}, g_viewports);
		each(map, function(key, map){
			var node = map.scope.context,
				qdom = Q(node);
			if (qdom.inViewport()) {
				delete g_viewports[key];
				map.callback && execCatch(map.callback);
				qdom.emit("viewport");
			}
		});
	}
	Q(win).on({
		scroll: handle,
		touchstart: handle,
		touchmove: handle
	});
	function trigger(){
		Q(win).emit("scroll");
	}
	/********* 当节点在显示视口时触发 end *******/
	//监听器的触发实现
	function watch(e, scope, emit) {
		var target = e.target,
			name = emit ? e.name : target.name||"",
			scope = getCtrlNode(target)[namespaceScope] || scope;
		if (name && (isInput(target) || emit) ) {
			fieldValue(scope, name, emit ? e.value : getInputValue(target));
			var value = getVarValue(scope, name);
			each(getBatList(scope[fieldWatchs], name), function(i, watch) {
				 execCatch(watch,[{name:name, value:value, source:scope[split(name)[0]], target:target}]);
			});
			compileVarName(name, scope);
		}
	}

	/** 应用 */
	function App(fun) {
		var me = this;
		Q(function(){
			me.__init(fun);
		})
	}
	extend(App.prototype, {
		__init: function(fun) {
			var me = this,
				scope = new Scope(),
				root = Q(nameRoot)[0];
			me.scope = scope;
			root[namespace] = getSpace(root);
			fun && fun(scope);
			compile(root, scope, true);//编译页面		
			trigger();
			
			function remove(e){
				var target = e.target,
					name = target.name,
					isInputDom = isInput(target),
					space = getSpace(target);
				if(space){
					var scope = space.scope;
					each(space.vars, function(i, _name) {
						var newmaps = [];
						if (isInputDom && name == _name) {
							return;
						}
						each(scope[nameMap][_name], function(i, dom) {
							dom != target && newmaps.push(dom);
						});
						scope[nameMap][_name] = newmaps;
					});
					if(isInputDom){
						delete scope[nameInput][name];
					}
				}		
			}
			function _change(e){
				watch(e, scope);
			}
			Q("body").on({
				change: _change,
				keyup: _change
			});
			Q(win).on({
				//DOMSubtreeModified: function(e){},
				DOMNodeInserted: function(e){//节点增加
					var target = e.target,
						space = getSpace(target);
					if(space){
						addScopeInput(target, space.scope);
						compile(target, space.scope);
					}
				},
				DOMNodeRemoved: remove //删除节点
			});
		},
		config: function(map){
			extend(g_config, map);
			return this;
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
	function Scope(context, rootScope) {
		var me = this;
		me[fieldWatchs] = {}; //监听器集合
		me[nameContext] = context = context || Q(nameRoot)[0]; //上文dom节点
		me.scopes = scopes;
		me.__name = Q(context).attr("q-ctrl") || "root"; //控制器名
		me[nameMap] = {}; //变量映射节点集合
		me.__cmd = {}; //预留
		me[nameInput] = {}; //input映射节点
		scopes[me.__name] = me;
		context[namespaceScope] = me;
		me[nameParentScope] = rootScope; //父scope
		$("input,select,textarea", context).each(function(i, dom) {
			addScopeInput(dom, me);
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
				me[fieldWatchs][name] = me[fieldWatchs][name] || [];
				me[fieldWatchs][name].push(value);
			});			
			return me;
		},
		/** 
			查询节点,在控制器下的范围内查询
		*/
		'$': function(sclector) {
			return Q(sclector, this[nameContext]);
		},
		on: function(name, handle){
			Q(this[nameContext]).on(name, handle)
		},
		off: function(name, handle){
			Q(this[nameContext]).off(name, handle)
		},
		once: function(name, handle){
			Q(this[nameContext]).once(name, handle)
		},
		apply: function(names, callback) { //应用会话信息的变更,同时刷新局部页面
			var me = this;
			if(Q.isFun(names)){
				callback = names;
				names = [];
			}else{
				names = Q.isArray(names) ? names : Q.isString(names) ? [names] : [];
			}
			//合并之前的更新 名册
			names = uniqueArray(names, (g_viewports[me.__name]||{}).names);
			g_viewports[me.__name] = {
				scope: me,
				names: names,
				callback: function(){
					function emitChange(names, callback){
						var isArray = Q.likeArray(names), name;
						each(names, function(i, list){
							name = isArray ? list : i;
							//var input = me.$("input[name='"+name+"']")[0];
							watch({
								target: me[nameContext],
								name: name,
								value: me[name]
							}, me, true);
							callback && callback(name, me);
						});
					}
					if(names.length > 0){
						/*each(names, function(i, name){
							var input = me.$("input[name='"+name+"']")[0];
							input ||	change({
								target: me[nameContext],
								name: name,
								value: me[name]
							}, me, true);
							compileVarName(name, me)
						});*/
						emitChange(names, compileVarName);
					}else{
						emitChange(me[fieldWatchs]);
						compile(me[nameContext], me);
					}
					Q.isFun(callback) && callback();
				}
			};
			delay(trigger, execInterval + 10);
		}
	});
	function addScopeInput(dom, scope){
		var name = dom.name, isSet=true;
		if(isInput(dom) && name){
			if(Scope.prototype[name] || /^__/.test(name) || new RegExp(name).test(keywords)){
				return Q.error("set scope["+scope.__name+"] name["+name+"] is illegal");
			}
			if(scope.__name == "root" && Q(dom).parents("[q-ctrl]").length>0){
				isSet = false;
			}
			if(isSet){
				fieldValue(scope, name, getInputValue(dom));
				scope[nameInput][name] = dom;
			}
		}
	}
	function uniqueArray(list1, list2){
		if(list1.length<1)return [];
		var list = list1.concat(list2 || []).sort(),
			result = [];
		for(var i=0,j;i<list.length;i++){
			for(j=i+1;j<list.length;j++){
				if(new RegExp("^"+list[i]).test(list[j])){
					list.splice(j,1);
					j--;
				}
			}
			result[i] = list[i];
		}
		return result;
	}
	function getBatList(map, name){
		if(name=="")return;
		var retWatchs = [];
		for(var i=0,end=split(name).length;i<end;i++){
			var watch = map[name];
			if(watch){
				retWatchs = watch.concat(retWatchs);
			}
			name = name.replace(/\.?[^\.]*$/,"");
		}
 		return retWatchs;
	}
	function isInput(dom){
		var name = dom ? dom.tagName : "";
		return name == "INPUT" || name == "SELECT" || name == "TEXTAREA"
	}
	/** 取界面上input输入标签的初始化值 */
	function getInputValue(node) {
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
		return vals.join("&")
	}
	var REG_VAR_NAME = /(\$\{\s*[\w\._-]*\s*\})|(\{\{\s*[\w\._-]*\s*\}\})/g;
	var REG_VAR_NAME_REP=/\s*((^(\$|\{)\{)|(\}?\}$))\s*/g;
	var REG_SCRIPT = /<\s*script/g;

	REG_VAR_NAME.compile(REG_VAR_NAME);
	REG_VAR_NAME_REP.compile(REG_VAR_NAME_REP);
	REG_SCRIPT.compile(REG_SCRIPT);

	/** 解析页面 */
	function compile(node, scope, isAdd) {
		Q("[q-ctrl]").css("visibility","visible");//置为可见
		replaceNodeVar(node, scope, isAdd, compileChilds);
	}
	function compileChilds(node, scope, isAdd){
		if(node && node != win){
			each(node.childNodes, function(i, node) {
				replaceNodeVar(node, scope, isAdd, compileChilds);
			})
		}
	}
	//取得变量名
	function getVarName(name) {
		return (name || "").replace(REG_VAR_NAME_REP, "");
	}
	function split(name){
		return name.split(".")
	}
	function fieldValue(object, names, val){
		var ns = Q.isArray(names) ? names : split(names), 
			field = ns[0];
		if(ns.length < 2){
			if(!isNull(val)){
				object[field] = val || object[field] || "";
			}
			return object[field];
		}
		object[field] = object[field] || {};
		ns.shift();
		return fieldValue(object[field], ns, val);
	}
	//取变量对应的值
	function getVarValue(scope, name) {
		var val = fieldValue(getUseSpaceScope(scope, name), name);
		return isNull(val) ? "" : val;
	}
	function getUseSpaceScope(scope, name){
		var field = split(name)[0];
		return isNull(scope[field]) && scope[nameParentScope] && !isNull(scope[nameParentScope][field]) ? scope[nameParentScope] : scope
	}
	/** 取控制器节点 */
	function getCtrlNode(node) {
		return Q(node).closest("[q-ctrl],"+nameRoot)[0]
	}

	//添加变量映射节点
	function addMapNode(scope, name, node) {
		scope = getUseSpaceScope(scope, name);
		if (scope) {
			addMapPush(scope, name, node)
		}
	}
	function addMapPush(scope, name, node){
		var retWatchs = [];
		for(var i=0,end=split(name).length;i<end;i++){
			var list = scope[nameMap][name] = scope[nameMap][name] || [];
			list.indexOf(node)<0 && list.push(node);
			name = name.replace(/\.?[^\.]*$/,"");
		}
 		return retWatchs;
	}
	function compileVarName(key, scope) {
		each(scope[nameMap][key], function(i, dom) {
			replaceNodeVar(dom, scope);
		});
	}
	/** 取存放到节点上的对象空间 */
	function getSpace(node){
		var ctrl = getCtrlNode(node);
		if(ctrl){
			return node[namespace] || {
				attr: {},
				vars: [],
				ctrl: ctrl,
				event: {},
				fors: {},
				scope: ctrl[namespaceScope]
			}
		}
	}
	function replaceNodeVar(node, scope, isAdd, callback) {
		var space = getSpace(node);
		if(!space)return;
		switch (node.nodeType) {
			case 1://正常节点
				each(node.attributes, function(i, attr){
					var attrName = attr.name,//属性名
						value = space.attr[attrName] = space.attr[attrName] || (attr.value || "").trim();
					if ("q-ctrl" === attrName) {//控制器
						if (value != "") {
							if(Q(node).parents("[q-ctrl]").length > 0){
								Q.warn("q-ctrl[",scope.__name,"] can't have child q-ctrl[", value,"]");
								Q(node).rmAttr("q-ctrl");
								return;
							}
							if(scopes[value]){
								scope = scopes[value];
							}else{
								scope = new Scope(node, scope);
								execCatch(function() {
									Q.isFun(ctrls[value]) ? ctrls[value](scope) : Q.warn("q-ctrl:[" + value + "]is not define");
								});
							}
						}
					} else if ("q-for" === attrName) { //for
						var vs = value.replace(/(\s){2,}/g, " ").split(" "),
							template = space.html = space.html || node.innerHTML,
							htmls = [],
							list = getVarValue(scope, vs[2]) || [],
							start = 0,
							qIndex = 0,
							section = parseInt(g_config.section) || 24;
						if(vs.length == 3 && vs[1]=="in"){
							Q(node).html("");
							space.fors[node] && space.fors[node].stop();//停止之前的进度
							space.fors[node] = Q.cycle(function(){
								if(start>=list.length){
									return space.fors[node].stop();
								}
								htmls = [];
								each(list.slice(start, start+section), function(i, item) {
									item.index = (qIndex++) + 1;
									var html = template.replace(REG_VAR_NAME, function(varName) {
										var reg = new RegExp("^" + vs[0] + "\."),
											name = getVarName(varName).replace(reg, ""),
											val = fieldValue(item, name);
										return val || "";
									});
									html = html.replace(REG_SCRIPT, "&lt;script");
									htmls.push(html);
								});
								start+=section;
								node.innerHTML += htmls.join("");

								compileChilds(node, scope, isAdd);//编译
							},50);
							node[namespace] = space;
							isAdd && addMapNode(scope, vs[2], node);	
						}else{
							Q.warn("q-for[",value,"] is error");
						}
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
					} else if (REG_VAR_NAME.test(value)) {//变量
						attr.value = value.replace(REG_VAR_NAME, function(name) {
							node[namespace] = space;
							name = getVarName(name);
							space.vars.push(name);
							var val = getVarValue(scope, name);
							isAdd && addMapNode(scope, name, node);							
							return val;
						});
					}
				});
				break;
			case 3://文本节点
				var val = space.text;
				val = isNull(val) ? node.textContent : val;
				if (REG_VAR_NAME.test(val)) {
					node[namespace] = space;
					space.text = val;
					node.textContent = val.replace(REG_VAR_NAME, function(name) {
						name = getVarName(name);
						space.vars.push(name);
						var val = getVarValue(scope, name),
							inputNode = scope[nameInput][name];
						isAdd && addMapNode(scope, name, node);
						if(inputNode && isInput(inputNode) && inputNode.value != val){
							if(inputNode.type !="checkbox" && inputNode.type != "select-multiple"){
								scope[nameInput][name].value = val;
							}
						}
						
						return val;
					});
				}
				break;
		}
		space.scope = scope;
		callback && callback(node, scope, isAdd);
	}

	var app;
	Q.app = function(rootCtrlFun){
		return app = app || new App(rootCtrlFun);
	};
	//
})(Qmik);