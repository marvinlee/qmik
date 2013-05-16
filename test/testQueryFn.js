// 测试查询后对fn方法的使用
(function(Q) {
	Q.config("debug", true);
	Q.log("");
	// 查询测试
	function testSelect() {
		var selector = arguments[0], fn = arguments[1], params = arguments[2] || [];
		module("查询语句:(" + selector + ")");
		// 开始单元测试
		test('test fn:>>(' + fn + "),,", function() {
			var ss = Q(selector);
			// alert(selector+"=="+ss.length)
			var result = fn ? ss[fn].apply(ss, params) : ss;
			
			if (result) {
				if (result.length) {
					if (fn) {
						ok(result, 'ok:' + selector + ".....length:." + result.length + ",,,,result::" + toString(result));
					} else {
						ok(result, 'ok:' + selector + "-fn:" + fn + ".....length:." + result.length + ",,,,result::" + toString(result));
					}
				} else {
					if (fn) {
						ok(result, 'ok:' + selector + "--" + fn);
					} else {
						ok(result, 'ok:' + selector + "-fn:" + fn);
					}
				}
 
				ss.append(result+"")
			} else {
				if (fn) {
					ok("yes", 'ok:' + selector + "--" + fn);
				} else {
					ok("yes", 'ok:' + selector + "-fn:" + fn);
				}
			}
		});
	}
	function toString(qmik) {
		var h = [];
		Q.each(qmik, function(i, v) {
			h.push(v);
		})
		return h.join("<br/>")
	}
	testSelect("div", "first");
	testSelect("div", "eq", [
		1
	]);
	testSelect("div", "even", [
		1
	]);
	testSelect("#query li");
	testSelect("#query li", "even", [
		1
	]);
	testSelect("#query li", "odd", [
		1
	]);
	testSelect("#query li", "gt", [
		5
	]);
	testSelect("#query li", "lt", [
		6
	]);
	testSelect("#part1", "find", [
		"span"
	]);
	testSelect("#part1 span", "each", [
		function(i, v) {
			Q.log(">>each:" + v)
		}
	]);
	// testSelect("#part1", "append", [Q("#part2")]);
	// testSelect("#part2", "remove", []);
	// testSelect("#part2", "before", [Q("#part3")]);
	testSelect("#part3", "html", [
		""
	]);
	testSelect("#part1", "closest", [
		"#query"
	]);
	testSelect("#p1li1", "parents", [
		"#query"
	]);
	testSelect("#p1li1", "parent", [
		"#query"
	]); // 0
	testSelect("#p1li1", "parent", [
		"ol"
	]); // >0
	testSelect("#p1li1", "addClass", [
		"addClass"
	]); // >0
	testSelect("#p1li1", "text", [
		"sb"
	]); // >0
	testSelect("#p1li1", "map", [
		function() {
			return 3;
		}
	]); // >0
	testSelect("#p1li1", "attr", [
		"gname", "gogo"
	]); // >0
	testSelect("#p1li1", "hide", []); // >0
	testSelect("#p1li1", "rmAttr", [
		"gname"
	]); // >0
	testSelect("#p1li1", "data", [
		"haha", "abc"
	]); // >0
	testSelect("#p1li1", "data", [
		"haha"
	]); // >0
	testSelect("#p1li1", "data", [
		"haha"
	]); // >0
	testSelect("#p1li1", "hasClass", [
		"addClass"
	]); // >0
})(Qmik);
