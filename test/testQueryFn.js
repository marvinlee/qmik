//测试查询后对fn方法的使用
(function($) {
	$.config("debug", true);
	$.log("");
	//查询测试
	function testSelect() {
		var selector = arguments[0], fn = arguments[1], params = arguments[2] || [];
		module("查询语句:(" + selector + ")");
		//开始单元测试
		test('test fn:>>(' + fn + "),,", function() {
			var ss = $(selector);
			var result = fn ? ss[fn].apply(ss, params) : ss;
			ok(result, 'ok:' + selector + ".....length:." + result.length + ",,,,result::" + toString(result));
		});
	}
	function toString(qmik){
		var h=[];
		$.each(qmik,function(i,v){
			h.push(v.outerHTML+"----------------------------------------------");
		})
		return h.join("<br/>")
	}
	testSelect("div", "first");
	testSelect("div", "eq", [1]);
	testSelect("div", "even", [1]);
	testSelect("#query li");
	testSelect("#query li", "even", [1]);
	testSelect("#query li", "odd", [1]);
	testSelect("#query li", "gt", [5]);
	testSelect("#query li", "lt", [6]);
	testSelect("#part1", "find", [" span"]);	
	testSelect("#part1 span", "each", [function(i,v){$.log(">>each:"+v)}]);	
	
	//testSelect("#part1", "append", [$("#part2")]);	
	
	//testSelect("#part2", "remove", []);	
	//testSelect("#part2", "before", [$("#part3")]);	
	testSelect("#part3", "html", [""]);	
	testSelect("#part1", "closest", ["#query"]);	
	testSelect("#p1li1", "parents", ["#query"]);	
	testSelect("#p1li1", "parent", ["#query"]);	//0
	testSelect("#p1li1", "parent", ["ol"]);	//>0
	
	testSelect("#p1li1", "addClass", ["addClass"]);	//>0
})(Qmik);