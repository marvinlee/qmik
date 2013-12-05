/**
 * @author:leo
 * @email:cwq0312@163.com
 * @deprecated nav导航(利用hashchang事件实现前进后退民航,支持刷新后的前进后退)<br/>
 * 依赖于Qmik,Qmik._query,Qmik._event, Qmik.sun模块
 *
 * 使用方式:$.nav.use( {
					module : $(this).attr("module"),//模块名,Qmik.sun注册的模块名
					method : $(this).attr("method"),//方法名,在模块module.method
					param : [//参数,方法method的参数
						$(this).attr("id")
					]
			})
 * @version:1.0
 */
(function(Q, define) {
	var win = Q.global, doc = win.document, loc = location, encode = Q.encode, //
	sun = Q.sun, isFun = Q.isFun, likeNull = Q.likeNull,gConstructor={}.constructor //
	session = win.sessionStorage, // 方法map
	config = {
		module : "module",// 处理方法标记名
		method : "method",
		enableTouch : false, //开户手势前进后退
		navDiff : 60 //手势滑动距离
	//defaultModule : {module:"","method","",param:[]}// 默认的hashchange处理模块
	}; //是否支持hash
	var isSupportHash = ("onhashchange" in win) && (doc.documentMode === undefined || doc.documentMode > 7);
	///////////////////////////////////////////////
	function setStore(key, val) {
		session && session.setItem(key, JSON.stringify(val))
	}
	function getStore(key) {
        try{
		    return session && session[key] ? JSON.parse(session[key]) : []
        }catch(e){
            return []
        }
	}
	//队列类
	function Queue(key) {
		var me = this;
		me.key = key;
		me._queue = getStore(key);
	}
	Q.extend(Queue.prototype, {
		pop : function() {//弹出
			var me = this, r = null;
			if (me.size() > 0) {
				r = me._queue[me.size() - 1];
				me._queue.splice(me.size() - 1, 1);
			}
			return r
		},
		push : function(item) {//压入
			var me = this;
			item && me.get(me.size()-1) != item && me._queue.push(item);
		},
		get : function(index) {
			return this._queue[index]
		},
		size : function() {//大小
			return this._queue.length
		}
	})
	var goBack = new Queue("store_nav_goBack"), goForward = new Queue("store_nav_goForward");//前进,后退队列
    function _unload(){
        setStore(goBack.key, goBack._queue);
        setStore(goForward.key, goForward._queue);
    }
    Q(window).on({
        "unload" : _unload
    });
	///////////////////////////////////////////////
	// 设置hash
	function setHash(hash) {
		loc.hash = hash;
	}
	// 取得hash
	function getHash() {
		return isSupportHash ? loc.hash.replace(/^#/g, "").trim() : loc.search.replace(/.*#/g, "").trim()
	}
	// 取得模块参数信息,及模块名
	function getModuleParam(hash) {
		var query = hash || getHash() || "", //
		info = [];
		Q.each(query.split(/&|&amp;/g), function(i, val) {
			var kv = val.split("=");
			info[Q.decode(kv[0])] = Q.decode(kv[1])
		});
		return info
	}
	function execModule(module, method, param) {
        module = getModule(module);
		var fun = likeNull(method) ? module : module[method];
        try{
		    return fun.apply(module, param || []);
        }catch(e){
            Q.log(module);
            Q.log(method);
            Q.log(param);
        }
	}
	// 加载使用模块
	function useModule(hash) {
		var moduleName, method, param;
		if (Q.isObject(hash)) {
			moduleName = hash.module;
			method = hash.method;
			param = hash.param
		} else {
			param = getModuleParam(hash);
			moduleName = param[config.module];
			method = param[config.method]
		}
		moduleName && sun.use(moduleName, function(module) {
			execModule(module, method, param || [])
		});
		return moduleName
	}
    function getModule(module){
        //module不是{}这种对象,并且 module 是方法且有 getInstance 取单例方法
        if(module.constructor != gConstructor && Q.isFun(module) && Q.isFun(module.getInstance) ){
            module = module.getInstance();
        }
        return module;
    }
	function hashchange() {
		// 当触发hashchange事件时,先使用hash,不行再使用url,再不行就使用默认的defaultModule
		useModule() || (likeNull(config.defaultModule) || useModule(config.defaultModule))
	}
	function bind() {
		Q(win).on("hashchange", hashchange)
	}
	function unBind() {
		Q(win).un("hashchange", hashchange, bind);
	}
	Q(doc).ready(function() {
		var hash = getHash(), bhash = goBack.get(goBack.size() - 1);
		if (hash != bhash) {
			goBack.push(hash)
		}
		hashchange();
		bind()
	});
	
	Q.extend({
		nav : {
			/**
			 * opts:{
			 w* param:[参数,选填,是个数组对象], 
			 * callback:回调方法,
			 * module:调用模块的模块名(alise:也是模块名,只是它是对模块名定义了一个别名) ,
			 * method:调用模块的方法名 
			 * }
			 */
			use : function(opts) {
				// {module:"",method:"",url:"",param:[],callback:fun}
				var param = opts.param || [], callback = param.callback, method = opts.method || "";
				sun.use(opts.module, function(module) {
                    //module不是{}这种对象,并且 module 是方法且有 getInstance 取单例方法
                    if(module.constructor != gConstructor && Q.isFun(module) && Q.isFun(module.getInstance) ){
                        module = module.getInstance();
                    }
					var hv = [];
					hv.push(encode(config.module) + "=" + encode(opts.module));
					hv.push(encode(config.method) + "=" + encode(method))
					Q.each(param, function(name, value) {
						hv.push(encode(name) + "=" + encode(value))
					});
					var hash = hv.join("&");
					unBind();//取消绑定
					setHash(hash);
					goBack.push(hash);
					var result = execModule(module, method, param);// module(param)
					callback && callback.apply(callback, [
						result
					]);
					Q.delay(bind, 500)//500ms后恢复绑定
				})
			},
            getInfo : function(name){
                var info=getModuleParam();
                return name ? info[name] : info
            },
			//后退
			back : function() {
				if (goBack.size() > 0) {
					var hash = goBack.pop();
					isSupportHash ? history.back() : useModule(hash);
					goForward.push(hash);
				}
			},
			//前进
			forward : function() {
				if (goForward.size() > 0) {
					var hash = goForward.pop();
					isSupportHash ? history.forward() : useModule(hash);
					goBack.push(hash);
				}
			},
			/**
			 * 在首页初次加载时执行,执行条件是判断hash值是否为空,为空才执行callback,
			 * 否则不执行
			 * @param callback
			 */
			onload : function(callback) {
				likeNull(getHash()) && callback()
			},
			/**
			 * 配置
			 * @param opt
			 * @return
			 */
			config : function(opt) {
				return Q.config(opt, config)
			}
		}
	});
//手势前进后退
	{
		////////////////////////
		var oStart = {
            x: 0,
            y: 0
        };
		var oDiff = {
            x: 0,
            y: 0
        };
        var direct;
        var isStart=false;
         //确定滑动方向,垂直=Y or 水平=X, 未确定=null
		function sureDirect(e) {
			var touch = e.touches ? e.touches[0] : e;
            oDiff.x = touch.clientX - oStart.x;
            oDiff.y = touch.clientY - oStart.y;
            if (Math.abs(oDiff.y) >= config.navDiff) {
                return "Y"
            }
            if (oDiff.x >= config.navDiff) {
                return "-X"
            }else if(oDiff.x <= -config.navDiff){
            	return "+X"
            }
            return null;
        }
        function _start(e) {
            direct = null;
            isStart = true;
            var touch = e.touches ? e.touches[0] : e;
            oStart.x = touch.clientX;
            oStart.y = touch.clientY;
        }
        function _move(e) {
       		if(isStart){
        		//判断滑动方向确定没有
	            if (Q.likeNull(direct)) {
	                direct = sureDirect(e);
	                return;
	            }
        	}
        }
        function _end(e) {
        	if(isStart){
        		isStart = false;
        		if (direct) {
	                e.preventDefault();
	                e.stopPropagation();
	            }
	            switch(direct){
	            case "+X":Q.nav.forward();break;
	            case "-X":Q.nav.back();break;
	            }
	            direct = null;
        	}
        }
        //如果没有绑定过事件,就绑定下

        if(Q("body").attr("data-bindNav")!="true"){
            Q("body").on({
                "touchstart": _start,
                "mouseover": _start,
                "mousedown":_start,
                "touchmove": _move,
                "mousemove": _move,
                "touchend": _end,
                "mouseup": _end
            }); 
        }
	}
	define(function(require, exports, module) {
		module.exports = Q
	});
})(Qmik, Qmik.define);
