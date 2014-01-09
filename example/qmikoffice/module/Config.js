/**
* 公用组件
*/
(function(Q) {

	// 配置Qmik工程的基础路径,如果没有配置,默认= location.protocol + "//" + location.hostname
	Q.config({
		context : "/qmik/qmikoffice/"
	});
	Q.config({
		debug : true
	});
	// 定义模块名及请求路径
	Q.sun.config({
		alias : {//别名系统(可以通过别名来引用js模块)
			// qmik组件
			"Qmik.nav" : Q.url("/qmik/qmikoffice/module/frame/qmik/Qmik.nav.js?${time}"),//
			// /
			"View" : "module/common/View.js?${time}",
			"BaseAct" : "module/common/BaseAct.js?${time}",
			"home" : "module/home/home.js?${time}",
			"QmikAPI" : "module/qmik/QmikAPI.js?${time}",
			"Download" : "module/download/Download.js?${time}",
			"Plug" : "module/plug/Plug.js?${time}",
			"About" : "module/about/About.js?${time}"
		},
		vars : {//变量系统
			time:Q.now()
			/*time:function(){
				return  parseInt(Q.now()/20000)
			}*/
		},//路径变量系统
		preload : [
			"Qmik.nav",
			"BaseAct"
		]
	});
})(Qmik);
