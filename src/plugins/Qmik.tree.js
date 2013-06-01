/**
 * 树形菜单插件
 * 
 * @author:leochen
 * @email:cwq0312@163.com
 * @version:1.0 使用例子 //order 表示是否显示数字 var
 *              data={id:"root",title:"播放列表",order:!0,list:[
 *              {id:"listLove",title:"喜欢",list:[
 *              {id:"100001",title:"因为爱情",list:[{id:"110001",title:"无用"}]},
 *              {id:"100002",title:"不是爱情"} ]}, {id:"listLose",title:"不喜欢",list:[
 *              {id:"200001",title:"因为爱情"} ]} ]} Q("#playList").tree(data)
 */
(function(Q, define) {
	var order = !0, m, dp = "QTreeId_";
	// build level tree
	function build(data) {
		var h = "<div id='" + (data.id || "") + "' node='root'" + (data["class"] ? (" class='" + data["class"] + "'") : "") + ">";
		h += "<li>" + data.title + "</li>";
		h += buildNode(data.list, 1);
		h += "</div>";
		return h;
	}
	function buildNode(list, level, pzid) {
		var h = level == 1 ? [
			"<ul>"
		] : [
			"<ul style='display:none'>"
		];
		Q.each(list, function(i, v) {
			if (Q.isNull(v)) return;
			var isLeaf = Q.isNull(v.list), p, id = Q.isNull(pzid) ? "tree_" + level + "_" + i : pzid + "_" + i;
			p = "<li id='" + id
					+ "' "
					+ "_url='"
					+ Q.url(v.url || "")
					+ "' "
					+ (v["class"] ? (" class='" + v["class"] + "'") : "")
					+ " node='"
					+ (isLeaf ? "leaf" : "")
					+ "'>";
			if (v.order == true || order) p += "<em>" + (level + "" + (i + 1)) + " </em>";
			p += "<a href='javascript:void(0)'" + ">";
			if (v.img) p += "<img src='" + v.img + "'/>";
			p += v.title + "</a></li>";
			h.push(p);
			if (!isLeaf) h.push(buildNode(v.list, level + 1, id));
		})
		h.push("</ul>");
		return h.join("");
	}
	function bind(target, callback) {
		if (Q.isNull(target) || target.length == 0) return;
		Q(target).click(function(e) {
			var tar = Q(e.target || e.srcElement), par = tar.closest("li");
			// tar = tar.attr("tagName") == "LI" ? Q(tar) : tar.closest("li");
			var next = par.next();
			if (next.attr("tagName") == "UL") {
				var is = Q(next[0]).css("display") != "none";
				Q.each(next, function(i, v) {
					is ? next.hide() : next.show()
				})
			} else if (par.attr("_url")) {
				callback(par.attr("id"), par.attr("_url"))
			}
		})
	}
	function Tree(qmik, data, callback) {
		data.id = data.id || "QmikTree";
		order = Q.likeNull(data.order) ? !1 : data.order;
		qmik.append(build(data));
		bind(Q("#" + data.id, qmik[0]), callback);
	}
	Q.extend(Tree.prototype, {
		// 显示菜单
		showMenu : function(id) {
			showParentMenu(Q("#" + id));
			return this;
		},
		click : function(callback) {
			return this;
		}
	});
	function _click() {
	}
	function showParentMenu(tar) {
		if (tar.length < 1 || tar.attr("node") == "root") return;
		tar.show();
		tar.closest("ul").show();
		showParentMenu(tar.closest("ul").prev("LI"));
	}
	Q.fn.extend( {
		tree : function(data, callback) {
			return new Tree(this, data, callback);
		}
	});
	define(function(require, exports, module) {
		module.exports = Q
	})
})(Qmik, Qmik.define);
