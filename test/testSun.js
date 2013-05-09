;
(function() {
	// 定义测试模块
	module("测试示例");
	// 定义一个简单的函数，判断参数是不是数字
	function simpleTest(para) {
		if (typeof para == "number") {
			return true;
		} else {
			return false;
		}
	}
	// 开始单元测试
	test('simpleTest()', function() {
		// 列举各种可能的情况，注意使用 ! 保证表达式符合应该的逻辑
		ok(simpleTest(2), '2是一个数字');
		ok(!simpleTest("2"), '"2"不是一个数字');
	});
	$(document).ready(function(Q) {
		console.log("document onload ready:");
	});
})();
Qmik.config("debug",true)
Qmik.sun.config( {
	alias : {
		'mo' : 'http://127.0.0.1/js/mo'
	}
});
Qmik.sun.define("ak", function(require, exports, module) {
	var v = require("mo");
	var b = require("mo");
	var c = require("mo");
	console.log("ak vvv mo:" + c+"--"+c());
	function log() {
		return 333;
	}
	module.exports=log
	return log;
});
$(document).ready(function(Q) {
	Qmik.sun.use("ak", function(ak) {
		console.log("use ak:" + ak + ":"+ak());
 
	})
	var d=document.body;
	document.getElementsBy
	var dd=document.getElementsByTagName("div");
	var d1=dd[0]
	console.log("==:"+Q.contains(dd[1],d1));

});

function abc(a,b,c){
	a("mm");
	a("a");
	
	return a+b+c
}
function parseDepents(code) {
	code=code.toString().replace(/\t?[\r\n]+/g," ");
	var params = code.replace(/^\s*function\s*\w*\s*/, "").match(/^\([\w, ]*\)/)[0].replace("\(","").replace("\)","");;
	var idx=params.indexOf(",");
	if(idx==-1)return;
	var require=params.substring(0,idx);
	var pattern = new RegExp(require+"\s*[(]\s*[\"']([^\"'\)]+)[\"']\s*[)]","g");
	var match=code.match(pattern)
	console.log(match)
}
//parseDepents('(require, exports, module) { 	var v = require("mo"); 	console.log("ak vvv mo:" + v); 	function log() { 		return 333; 	} 	return log; } ');

var m={name:"aaa"};
m=Qmik.extend(m,{age:33});
console.log(Qmik.stringify(m));

Qmik.delay(function(a,b){
	console.log("delay:"+a+":"+b);
},500,10,20);
var url="http://a.com/a.css?asdf/afasdf/er 中圖  /中圖.css?afa.css/asdf?qq/q.css/aa.js";
var nurl=url.substring(0,url.indexOf("?")).trim();
var isCSS = /\/.+\.css$/i.test(nurl);
console.log("=============1:"+isCSS)