//环境配置文件
/**
* 公用组件
*/
(function(Q) {
	// 配置Qmik工程的基础路径,如果没有配置,默认= location.protocol + "//" + location.hostname
	Q.config({
		context : location.pathname.replace(/\/[^\/]*$/,"") //配置上下文环境路径用的,默认为 "/"
	});

	// 定义模块名及请求路径
	Q.sun.config({
		alias : {//别名系统(可以通过别名来引用js模块)
			"Page1" : Q.url("Page1.js?${time}"),
			"Page2" : Q.url("Page2.js?${time}"),
			"Page3" : Q.url("Page3.js?${time}")
		},
		vars : {//变量系统
			time:Q.now()
			/*time:function(){
				return  parseInt(Q.now()/20000)
			}*/
		},
		preload : [//预加载模块
		]
	});
})(Qmik);
