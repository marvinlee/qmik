(function() {

	$.app().ctrl({
		//左边导航控制器
		leftNav: function(scope){
			ctrlLeftNav(scope);
		},
		//右边desc控制器
		desc: function(scope){
			ctrlDesc(scope)
		}
	});
	//左边导航控制器
	function ctrlLeftNav(scope){
		$.use("../data/nav.js?"+$.now(), function(data){
			var list = [];
			$.each(data.list, function(i, val){
				val.url=val.url||"#";
				list.push(val);
				$.each(val.list, function(j, val1){
					list.push(val1);
				})
			});
			scope.model = {
				list: list
			};
			scope.apply(["model.list"]);
		});
		//绑定事件
		scope.on({
			click: function(e){//单击事件
				var ele = e.target;
				if( ele.tagName == "A" ){
					var url = (ele.href||"").replace(/^[^#]*#/,"")+".html";
					$.get("../view/helper/"+url, function(html){
						html = dealHtml(html);
						var descScope = scope.scopes.desc;//取到右边的desc控制器的会话
						descScope.$('.v-desc').hide();
						descScope.$('.v-helper').show().html(html);
					});
				}
			}
		});
	}
	//右边desc控制器
	function ctrlDesc(scope){
		$.use("../data/desc.js?"+$.now(), function(data){
			scope.model = data;
			//scope.model.desc="sdf";
			$.get("../view/helper/desc/use.html", function(html){
				html = dealHtml(html);
				scope.$('.v-use-code').html(html);
			});
			scope.apply(["model.desc"]);
		});
	}
	function dealHtml(html){
		return html.replace(/\$\s*\{/g, "$ {");
	}
	///
})();
///