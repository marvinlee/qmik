/**
	执行任务队列
*/
;
(function(Q) {
	//串行执行任务列队,报错不继续执行,各任务间有依赖关系
	function execSeriesTasksWithParam(tasks, callback) {
		var length = tasks.length;
		length == 0 ? callback && callback() : (function bload(idx, param) {
			execTask(tasks[idx], function(err, exports) {
				if (err) {
					callback && callback(err);
				} else {
					idx == length - 1 ? callback && callback(err, exports) : bload(idx + 1, exports)
				}
			}, param);
		})(0, null);
	}
	//串行执行任务列队,报错继续执行,各任务之间没有依赖关系
	function execSeriesTasksWithParallel(tasks, callback) {
		var length = tasks.length;
		length == 0 ? callback && callback() : (function bload(idx) {
			execTaskNoArgs(tasks[idx], function(err) {
				if (err) {
					if (err instanceof Error) {
						console.error(err, err.stack);
					} else {
						console.error(err);
					}
				}
				if (idx == length - 1) {
					callback && callback(err);
				} else {
					bload(idx + 1);
				}
				//(idx == length - 1 || err) ? callback && callback() : bload(idx + 1)
			})
		})(0);
	}
	var dealTasks = 3; //多少个处理核心在处理同时任务
	//并行执行任务列队
	function execParallelTasks(tasks, callback) {
		var length = tasks.length,
			params = new Array(length),
			dealTask = 0;
		var pageSize = parseInt((tasks.length - 1) / dealTasks) + 1; //每组要处理的长度

		var groups = new Array(dealTasks < tasks.length ? dealTasks : tasks.length); //几组

		for (var i = 0; i < groups.length; i++) {
			var group = tasks.slice(i * pageSize, (i + 1) * pageSize);
			groups[i] = group;
		}
		var dealGroup = 0;
		for (var i = 0; i < groups.length; i++) {
			(function(idx, group) {
				execSeriesTasksWithParallel(group, function() {
					dealGroup++;
					if (dealGroup == groups.length) { //处理完毕
						callback();
					}
				});
			})(i, groups[i]);
		}
	}
	

	function execTask(task, callback, param) {
		try {
			var exports = task(callback, param);
		} catch (e) {
			console.error(e.stack);
			callback(e);
		}
	}

	function execTaskNoArgs(task, callback) {
		try {
			var exports = task(callback);
		} catch (e) {
			console.error(e, e.stack);
			callback(e);
		}
	}
	//function Task() {};
	var Task = {};

	//串行执行任务列队,如果有输出参数,则前一个任务输出参数给下一个任务
	/*
		Task.series([
			function(callback){//callback:function(err, value){}
				var m = {};
				callback(null, m);
			},
			function(callback, val){
				callback(null, {name:"leo"});
			},
			function(callback, val){
				callback(null, {name:"leo"});
			}
		],function(err, exports){

		});
	*/
	Task.series = function(tasks, callback) {
		execSeriesTasksWithParam(tasks, function(err, exports) {
			try {
				callback(err, exports);
			} catch (e) {
				console.error(e, e.stack);
			}
		});
	};

	//并行执行任务列队
	//task:[function(callback(fun){}){}; callback:function(){};
	/*
		Task.parallel([
			function(callback){//callback: function(){}
				callback();
			},
			function(callback){
				callback();
			}
		],function(){

		});
	*/
	Task.parallel = function(tasks, callback) {
		execParallelTasks(tasks, callback);
	};
	Q.task = Task;
	Q.series = series;
	Q.parallel = parallel;
})(Qmik); //