/**
 * 首页家庭页面显示模块
 */
(function(Q, define) {
	define(function(require, exports, module) {
		var index = require("index");
		require("Qmik.tree");
		function showGP(v) {// 显示目标,并显示其父节点
			v = Q.isQmik(v) ? v[0] : v;
			if (Q.likeNull(v) || v.tarName == "BODY") return;
			Q(v).show();
			showGP(v.parentNode);
		}
		function showHelpContent(id) {
			showHelp();
			var tar = Q.likeNull(id) ? Q(this) : Q("#" + id), url = tar.attr("url");
			showGP(tar);
			if (!Q.likeNull(url)) {
				Q.ajax( {
					url : url,
					success : function(data) {
						Q("#helpContent").html(data || "整理中...")
						Q("#codeDesc p").each(function(i, v) {
							v = Q(v);
							var h = v.html().replace(/^[\s]+|[\s]$/, "");
							v.html(h.replace(/[\r\n]/g, "<br/>"))
						});
						Q("#codeDesc textarea").each(function(i, v) {
							v = Q(v);
							var h = v.html().replace(/\s/g, "");
							v.html(h)
						});
					},
					error : function() {
						Q("#helpContent").html("整理中...");
					}
				});
			}
		}
		function showHelp() {
			show("link-help");
			if ($("#help #helpRoot").length > 0) return;
			$.ajax( {
				url : "/demo/Qmik-view/help.data?abc",
				dataType : "json",
				success : function(data) {
					$("#helpTree").tree(data);
					$("#help #helpRoot a").bind("click", showHelpContent, "")
				}
			})
		}
		function exp(id) {
			$.ajax( {
				url : "/example/qmik/data/api.json",
				dataType : "json",
				success : function(data) {
					index.showNav(id);
					Q(".panel").hide();
					Q("#api").show();
					$("#helpTree").tree(data);
					$("#help #helpRoot a").bind("click", showHelpContent, "");
				}
			})
		}
		module.exports = exp
	});
})(Qmik, Qmik.define);
