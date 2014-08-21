$.define("demo/Demo2",function(require, exports, module){
	
	module.exports = {
		doing:function(msg){


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