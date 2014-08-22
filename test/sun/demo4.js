$.define("demo/Demo4",function(require, exports, module){
 
	module.exports = {
		doing:function(msg){
			var Demo = require("demo/Demo3");
			console.log("  bg  /*");
			console.log("loading:// require('bbb')   //x*/  ");
			console.log("ab //");require("demo/Demo3");
			
			/*$.use(["http://g.tbcdn.cn/tmmob/lib-store/2.0.0/store.js",'http://g.tbcdn.cn/tmmob/lib-loadimg/1.0.0/loadimg.js'],
				function(Store,Loadimg){
				console.log("store:",Store, msg);
				console.log("Loadimg:",Loadimg, msg);
				require("bb1");
			});*/
			console.log("a('bb')")
			//var Demo1 = require("demo/Demo1");
			//Demo.doing(msg);
			console.log("demo4>demo3:",msg);
			Demo.do1(msg);
			//Demo1.doing(msg);
			console.log("doing demo4",msg);
		}

	};
});