;
(function(Q) {
	Q.config("debug", true);
	Q.sun.config({
		alias: {
			'qmik/Loadimg': 'http://g.tbcdn.cn/tmmob/lib-loadimg/1.0.0/loadimg.js',
			'qmik/Store':'http://g.tbcdn.cn/tmmob/lib-store/1.0.0/store.js'
		},
		vars: {
			time: parseInt(Q.now() / 3600000)
		}
	});
	Q.define("test/Mo", function(require, exports, module) {
		var Mo = {
			exec: function(msg) {
				console.log("Mo.exec:", msg);
			}
		};
		module.exports = Mo;
	});
	Q.define("test/Style", function(require, exports, module) {
		var Style = {
			exec: function(msg) {
				console.log("Style.exec:", msg);
			}
		};
		module.exports = Style;
	});
	Q.define("test/Pop", function(require, exports, module) {
		var Pop = {
			exec: function(msg) {
				console.log("Pop.exec:", msg);
			}
		};
		module.exports = Pop;
	});
	Q.use(["test/Mo","test/Style", "test/Pop"], function(Mo, Style, Pop) {
		Mo.exec("haha test mo");
		Style.exec("yoxi  test Style");
		Pop.exec("  yoxi  test Pop");
	});

	Q.use(["qmik/Loadimg", 'qmik/Store'], function(Loadimg, Store) {
		Loadimg.load();
		Store.set("gogo", "bb");
		Store.get("gogo")
	});


})(Qmik);