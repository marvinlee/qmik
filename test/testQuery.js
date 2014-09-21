(function($) {
	$.config({debug: true});
	$.log("");
	function capability() {
		var old = $.now();
		for ( var i = 0; i < 50000; i++) {
			$("div ol>li[flag=p1]");
		}
		$.log("---" + ($.now() - old));
		alert("---" + ($.now() - old))
	}
	// 查询测试
	function testSelect(selector) {
		//module("查询语句:(" + selector + ")");
		// 开始单元测试
		test('queryTest()', function() {
			// 列举各种可能的情况，注意使用 ! 保证表达式符合应该的逻辑
			ok(queryTest(selector), 'ok:' + selector);
		});
	}
	function testAPI(api,args){
		module("testAPI:" + api + "");
		var qbody = $("body");
		var v = qbody[api].apply(qbody, args);
		console.log("api:",api,"__",v);
	}
	// 定义一个简单的函数，判断参数是不是数字
	function queryTest(selector) {
		$.log("查询语句  :" + selector);
		if (document.querySelectorAll) {
			var length1 = $(selector).length, length2 = document.querySelectorAll(selector).length;
			$.log("\t\t结果:" + selector + "," + length1 + "--" + length2);
			return length1 == length2
		}
		return $(selector).length>=0
	}

	testSelect("div");
	testSelect("#part1");
	testSelect("#part2 ol");
	testSelect("#part2>ol>li");
	testSelect("#part2 li");
	testSelect("#part2 li[flag=p1]");
	testSelect("#part2 li[flag=p2]");
	testSelect("#part2>li[flag=p2]");
	testSelect("#part2 li");
	//capability();

	testAPI("html",["<div>dfasd</div>"]);
})(Qmik);