/**
	任务执行模块,

	串行执行任务列队,如果有输出参数,则前一个任务输出参数给下一个任务
	$.series([
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
		//全部执行完,回调
	});

	并行执行任务列队,当中有任务执行出错,不影响其它任务的执行
	$.parallel([
		function(callback){//callback: function(){}
			callback();
		},
		function(callback){
			callback();
		}
	],function(){
		//全部执行完,回调
	});
*/
;
(function(Q) {
	var execCatch = Q.execCatch;
	//串行执行任务列队,报错不继续执行,各任务间有依赖关系
	function execSeriesTasksWithParam(tasks, callback) {
		var length = tasks.length;
		length == 0 ? callback() : (function bload(idx, param) {
			execTask(tasks[idx], function(err, exports) {
				if (err) {
					callback(err);
				} else {
					idx == length - 1 ? callback(err, exports) : bload(idx + 1, exports)
				}
			}, param);
		})(0, null);
	}
	//串行执行任务列队,报错继续执行,各任务之间没有依赖关系
	function execSeriesTasksWithParallel(tasks, callback) {
		var length = tasks.length;
		length == 0 ? callback() : (function bload(idx) {
			execTaskNoArgs(tasks[idx], function() {
				idx == length - 1 ? callback() : bload(idx + 1);
			})
		})(0);
	}
	var dealTasks = 3; //多少个处理核心在处理同时任务
	//并行执行任务列队
	function execParallelTasks(tasks, callback) {
		var length = tasks.length,
			params = new Array(length);
		var pageSize = parseInt((length - 1) / dealTasks) + 1; //每组要处理的长度
		var groups = new Array(dealTasks < length ? dealTasks : length); //几组

		/*for (i = 0; i < groups.length; i++) {
			groups[i] = tasks.slice(i * pageSize, (i + 1) * pageSize);
		}
		for (i = 0; i < groups.length; i++) {
			(function(idx, group) {
				execSeriesTasksWithParallel(group, function() {
					dealGroup++;
					if (dealGroup == groups.length) { //处理完毕
						callback();
					}
				});
			})(i, groups[i]);
		}*/
		Q.each(groups, function(i) {
			groups[i] = tasks.slice(i * pageSize, (i + 1) * pageSize);;
		});
		var dealGroup = 0;
		Q.each(groups, function(i, group) {
			execSeriesTasksWithParallel(group, function() {
				dealGroup++;
				dealGroup == groups.length && callback();
			});
		});
	}


	function execTask(task, callback, param) {
		execCatch(task, [callback, param], callback);
	}

	function execTaskNoArgs(task, callback) {
		execCatch(task, [callback], callback);
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
			err && Q.log(err, err.stack);
            execCatch(callback, [err, exports]);
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
		execParallelTasks(tasks, function() {
			execCatch(callback);
		});
	};
	Q.task = Task;
	Q.series = Task.series;
	Q.parallel = Task.parallel;
})(Qmik); //