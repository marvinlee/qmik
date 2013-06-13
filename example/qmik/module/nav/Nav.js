/**
 * 导航菜单模块
 */
(function($, define) {
	define(function(require, exports, module) {
		$.extend(exports, {
			//显示快捷菜单 
			showShortcut : function() {
				if ($("#shortcut").length < 1) {
					$.get("module/nav/shortcut.html", function(data) {
						$("#shortcut_module").html(data);
						$("#apiHelp").live("click",function(){
							$("#link-api").trigger("click")
						})
					})
				}
			},
			//显示头部导航条
			showHeader : function() {
				if ($("#shortcut").length < 1) {
					$.get("module/nav/header.html", function(data) {
						$("#head_module").html(data);
						exports.showShortcut();
						//事件绑定
						$("#head a[tag=nav]").click(function(a) {
							$.log("1:click:>module:" + $(this).attr("module")+'-'+$(this).attr("method"))
							$.nav.use( {
								module : $(this).attr("module"),//模块名
								method : $(this).attr("method"),//方法名
								param : [//参数
									$(this).attr("id")
								]
							})
						});
					})
				}
			}
		})
	})
})(Qmik, Qmik.sun.define);
