(function(){
	var context = location.protocol+"//"+location.hostname+location.pathname;
	context = context.replace(/[^\/]*\s*$/, "");
	$.config({
		context:context
	});
	
	var app = $.app(function(scope){
		scope.title="xoxoxoxo";
	});

	app.ctrl({
		nav: function(scope){
			$.use(context+"js/nav.js", function(nav){
				nav.init(scope);
			});			
			scope.tclick=function(e){
				var dom = e.target;
				scope.scopes.main.value="";
				if(dom.tagName == "A"){
					scope.scopes.main.title="gdgd";
					scope.scopes.main.apply();
				}
				var list = ["a","b","c","d","e"];
				app.scope.title="hi "+ list[parseInt(Math.random()*list.length)];
				app.scope.apply(["title"]);
			}
		},
		main: function(scope){
			$.use(context+"js/main.js", function(main){
				main.init(scope);
			});

		}
	});
})();