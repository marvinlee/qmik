/**
 * @author:leo
 * @email:cwq0312@163.com
 * @version:1.00.000
 */
(function(Q) {
	var win = Q.global, box = {};
	var config = Q.config({
		box : {
			enable : !1,//对box异常收集的支持,默认不启用
			ttl : 20000,//收集时间间隔
			url : "/errorCollect" //收集地址
		}
	}).box;
	Q.box = function(callback) {
		//enable box error notify:Q.config(error,{enable,url:"send you service"});
		return config.enable ? function() {
			try {
				callback.apply(null, arguments)
			} catch (e) {
				collect(e);
				throw e
			}
		} : callback
	};
	///////////////////////////////////////////////////////
	//box bariable
	var errorStack = {
		count : 0
	};
	//收集错误信息
	function collect(e) {
		if (config.enable) {
			// Q.config(box,{enable,url:""});
			//enable support box error send to service
			var stack = e.stack, log = errorStack[stack];
			if (log) {
				log.num++
			} else {
				log = errorStack[stack] = {
					num : 1
				};
				errorStack.count++
			}
		}
	}
	function send() {
		var img;
		if (config.enable && errorStack.count > 0) {
			img = new Image();
			img.src = config.url + "?log=" + toString(errorStack);
			errorStack = {
				count : 0
			}
		}
		Q.delay(send, config.ttl)
	}
	Q.delay(send, config.ttl);
	Q(win).on("error", collect);
	//
	box.collect = collect;
	Q.box = box;
})(Qmik);
