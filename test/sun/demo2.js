$.define("demo/Demo2",function(require, exports, module){
	
	module.exports = {
		doing:function(msg){
			var Loadimg = require("http://g.tbcdn.cn/tmmob/lib-loadimg/1.0.0/loadimg.js");
			var Store = require("http://g.tbcdn.cn/tmmob/lib-store/2.0.0/store.js");//require("34")

			var Demo = require("demo/Demo1");
			var Demo3 = require("demo/Demo3");
			var Demo4 = require("demo/Demo4");
 			Demo.doing(msg);
 			Demo3.doing(msg);
 			Demo4.doing(msg);
			console.log("doing demo2 ",msg);
		}

	};
});