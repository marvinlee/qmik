/**
 * 首页家庭页面显示模块
 */
(function(Q, define) {
	var xmlSerializer = new XMLSerializer();

	define(function(require, exports, module) {
		var index = require("index");
		var formate = require("doing").formate;
		require("Qmik.tree");
		function showParentULLI(tar) {
			Q.log("-------")
			Q.log(tar)
			if (tar.length < 1 || tar.attr("node") == "root") return;
			tar.show();
			Q.log(tar.closest("ul"));
			tar.closest("ul").show();
			showParentULLI(tar.closest("ul").prev("LI"));
		}
		var tree, isLoadMenu = false;
		Q.extend(exports, {
			/**
			 * 显示菜单 <br/> navId: 导航条的id; id:菜单里子菜单的id
			 */
			showMenu : function(navId, id) {
				Q.log("use module api:showMenu;")
				index.showNav(navId);
				Q("#head").css("background", "#fffaaa")
				Q(".panel").hide();
				Q("#api").show();
				if (!isLoadMenu) {
					Q.ajax( {
						url : Q.url("data/api.json"),
						dataType : "json",
						success : function(data) {
							isLoadMenu = true;
							tree = $("#helpTree").tree(data, function(id, url) {
								Q.nav.use( {
									module : module.id,
									method : "showAPI",
									param : [
										id, url
									]
								})
							});
							id && tree.showMenu(id);
						}
					})
				}
			},
			// 显示api帮助说明内容
			showAPI : function(id, url) {
				Q.log("use module api:showAPI;")
				// 此模块方法,依赖此模块的showMenu方法
				exports.showMenu("link-api", id);
				Q.ajax( {
					url : url,
					dataType : "xml",
					success : function(data) {
						data = xmlToJson(data);
						if (data) {
							var h = [];
							h.push('<div class="code_title"><h3>' + data.title + '</h3></div>');
							if (data.desc) {
								h.push('<div class="code_desc"><div>描述:</div><div>' + data.desc + '</div></div>');
							}
							h.push('<div class="code_examples">');
							Q.each(data.examples, function(i, value) {
								h.push('<div class="code_exp">');
								h.push('<div class="code_exp_title">' + value.title + '</div>');
								if (value.code) {
									h.push('<div class="code_exp_code"><div>代码:</div><div><textarea flag="code">' + value.code
												+ '</textarea></div></div>');
								}
								if (value.desc) {
									h.push('<div class="code_exp_desc"><div>描述:</div><div>' + value.desc + '</div></div>');
								}
								h.push('</div>');
							})
							h.push('</div>');
							Q("#helpContent").html(h.join(""));
							formate(Q("div.code_exp_code textarea[flag='code']"));
						}
					}
				})
			}
		});
	});
	// Changes XML to JSON
	function xmlToJson(xml) {
		var nodeName = xml.nodeName;
		var json = {};
		if (xml.hasChildNodes() && xml.childNodes.length == 1) {
			var value = xml.nodeValue;
			if (Q.isString(value)) return value.trim();
		}
		switch (nodeName) {
		case "#document":
			json = xmlToJson(xml.childNodes.item(0))
			break;
		case "root":
			if (xml.hasChildNodes()) {
				for ( var i = 0; i < xml.childNodes.length; i++) {
					var item = xml.childNodes.item(i);
					var name = item.nodeName;
					switch (name) {
					case "examples":
						json[name] = [];
						if (item.hasChildNodes()) {
							for ( var j = 0; j < item.childNodes.length; j++) {
								var iitem = item.childNodes.item(j);
								var iname = iitem.nodeName;
								if (iname != "#text") {
									json[name].push(xmlToJson(iitem));
								}
							}
						}
						break;
					case "#text":
						json["text"] = item.nodeValue.trim();
						break;
					case "desc":
					case "code":
					case "title":
						if (item.hasChildNodes()) {
							json[name] = xmlSerializer.serializeToString(item.childNodes.item(0));
							json[name] = json[name].replace("<", "&lt;").replace(">", "&gt;");
						}
						break;
					default:
						json[name] = xmlToJson(xml.childNodes.item(0));
						break;
					}
				}
			}
			break;
		case "#text":
			json["text"] = xml.nodeValue.trim();
			break;
		case "desc":
		case "code":
		case "title":
			if (xml.hasChildNodes()) {
				var h = [];
				for ( var k = 0; k < xml.childNodes.length; k++) {
					h.push(xmlSerializer.serializeToString(xml.childNodes.item(k)))
				}
				return h.join("").replace("<", "&lt;").replace(">", "&gt;");
			}
			break;
		default:
			switch (xml.nodeType) {
			case 3:// text
				return xml.nodeValue.trim()
			default:
				if (xml.hasChildNodes()) {
					for ( var i = 0; i < xml.childNodes.length; i++) {
						var item = xml.childNodes.item(i);
						var name = item.nodeName;
						json[name] = xmlToJson(item);
					}
				}
			}
			break;
		}
		return json;
	}
})(Qmik, Qmik.define);
