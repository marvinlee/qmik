;
(function($) {
	$.config("debug", true);
	var tasks1 = new Array(10);
	$.each(tasks1, function(i, task) {
		tasks1[i] = function(callback, exports) {
			console.log("exec series tasks1 ", i, " exports:", exports);
			exports = "export value:" + i;
			callback(null, exports);
		}
	});
	$.series(tasks1, function(err, exports) {
		console.log("exec series tasks1 is end");
	});


	$.config("debug", true);
	var tasks2 = new Array(10);
	$.each(tasks2, function(i, task) {
		tasks2[i] = function(callback, exports) {
			$.delay(function() {
				console.log("exec series taskss ", i, " exports:", exports);
				exports = "export value:" + i;
				callback(null, exports);
			}, parseInt(Math.random() * 1000));
		}
	});
	$.series(tasks2, function(err, exports) {
		console.log("exec series tasks2 is end ", err, exports);
	});


	$.config("debug", true);
	var tasks1 = new Array(10);
	$.each(tasks1, function(i, task) {
		tasks1[i] = function(callback) {
			//$.delay(function() {
				console.log("exec parallel taskss ", i);
				callback();
			//}, parseInt(Math.random() * 1000));
		}
	});
	$.parallel(tasks1, function(err) {
		console.log("exec parallel tasks1 is end");
	});

	//
})(Qmik);