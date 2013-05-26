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
	var order = !0, m, dp = "QTreeId_", did = 1;
	// build level tree
	function build(data) {
		var h = "<div id='" + (data.id || "") + "'" + (data["class"] ? (" class='" + data["class"] + "'") : "") + ">";
		h += "<li>" + data.title + "</li>";
		h += buildNode(data.list, 1);
		h += "</div>";
		return h;
	}
	function buildNode(list, level) {
		var h = level == 1 ? [
			"<ul>"
		] : [
			"<ul style='display:none'>"
		];
		Q.each(list, function(i, v) {
			if (Q.isNull(v)) return;
			var isLeaf = Q.isNull(v.list), p;
			p = "<li" + (v["class"] ? (" class='" + v["class"] + "'") : "") + " node='" + (isLeaf ? "leaf" : "") + "'>";
			if (v.order == true || order) p += "<em>" + (level + "" + (i + 1)) + " </em>";
			p += "<a href='javascript:void(0)' url='" + (v.url || "") + "'  id='" + (v.id || (dp + did)) + "'>";
			if (v.img) p += "<img src='" + v.img + "'/>";
			p += v.title + "</a></li>";
			h.push(p);
			did++;
			if (!isLeaf) h.push(buildNode(v.list, level + 1));
		})
		h.push("</ul>");
		return h.join("");
	}
	function bind(list) {
		if (Q.isNull(list) || list.length == 0) return;
		Q.each(list, function(i, v) {
			if (Q.isNull(v)) return;
			var t = Q(v);
			t.bind("click", function(e) {
				var cs = t.next("ul"), is = Q(cs[0]).css("display") != "none";
				Q.each(cs, function(i, v) {
					is ? cs.hide() : cs.show()
				})
			})
			if (v.list) bind(v.list)
		})
	}
	Q.fn.extend( {
		tree : function(data) {
			m = this;
			data.id = data.id || "QmikTree";
			order = Q.likeNull(data.order) ? !1 : data.order;
			this.append(build(data));
			bind(Q("#" + data.id + " ul li", this[0]));
		}
	})
	Q.sun.define(function(require, exports, module) {
		module.exports = Q
	})
})(Qmik, Qmik.define);
