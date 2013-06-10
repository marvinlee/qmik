/**
 * @author:leochen
 * @email:cwq0312@163.com
 * @version:1.0
 */
(function($) {
	var doc = document, win = window, loc = location;
	function register() {
		$.navHash.register("home", show);
		$.navHash.register("about", show);
		$.navHash.register("plugin", show);
		$.navHash.register("download", show);
		$.navHash.register("team", show);
		$.navHash.register("help", showHelp);
		$.navHash.register("helpContent", showHelpContent);
	}
	register();
	function showGP(v) {// 显示目标,并显示其父节点
		v = $.isQmik(v) ? v[0] : v;
		if ($.likeNull(v) || v.tarName == "BODY") return;
		$(v).show();
		showGP(v.parentNode);
	}
	function showHelpContent(id) {
		showHelp();
		var tar = $.likeNull(id) ? $(this) : $("#" + id), url = tar.attr("url");
		showGP(tar);
		if (!$.likeNull(url)) {
			$.ajax( {
				url : url,
				success : function(data) {
					$("#helpContent").html(data || "整理中...")
					$("#codeDesc p").each(function(i, v) {
						v = $(v);
						var h = v.html().replace(/^[\s]+|[\s]$/, "");
						v.html(h.replace(/[\r\n]/g, "<br/>"))
					});
					$("#codeDesc textarea").each(function(i, v) {
						v = $(v);
						var h = v.html().replace(/\s/g, "");
						v.html(h)
					});
				},
				error : function() {
					$("#helpContent").html("整理中...");
				}
			});
			$.navHash.change("helpContent", [
				tar.attr("id")
			]);
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
	function showNav(id) {
		$("div.panel").hide();
		$("#head a").rmClass("head_click_a");
		id = id || "home";
		var tar = $("#" + id);
		var flag = tar.attr("url") || "home";
		$("#" + flag).fadeOut(1);
		tar.addClass("head_click_a");
	}
	function show(id) {
		id = id || "home";
		showNav(id);
		var tar = $("#" + id);
		var flag = tar.attr("url") || "home";
		$.navHash.change(flag, [
			id
		]);
	}
	$(document).ready(function() {
		var m = document.getElementById("about");
		$("#head a[tag=nav]").bind("click", function(a) {
			show($(this).attr("id"));
		}, "aa");
		$("#link-help").bind("click", function() {
			showHelp($(this).attr("id"));
		})
	})
})(Qmik);
