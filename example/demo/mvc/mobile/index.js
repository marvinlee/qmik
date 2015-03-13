(function($) {
	//$.app();生成全局页面app,并编译页面,全局唯一 
	$.app(function(scope) { //全局控制器声明方式
		scope.scale = getScale();
		scope.apply(["scale"]); //应用并更新界面,控制器处在可见的视口上才会触发
		//$('html meta[name="viewport"]').attr("content", '');
	}).ctrl({
		model2002122: function(scope) { //局部控制器
			getData(function(data) {
				var model = data.content.model2002122;
				scope.model = model;
				scope.list = model.itemList;
				scope.apply(); //应用并更新界面,控制器处在可见的视口上才会触发
			});
		},
		model2002119: function(scope) { //局部控制器
			getData(function(data) {
				var model = data.content.model2002119;
				scope.model = model;
				scope.itemLeft = model.itemList[0];
				scope.itemCenter = model.itemList[1];
				scope.brand = model.itemList[2];
				scope.apply(); //应用并更新界面,控制器处在可见的视口上才会触发
			});
		},
		model2002111: function(scope) { //局部控制器
			getData(function(data) {
				var model = data.content.model2002111;
				scope.model = model;
				scope.item = model.itemList[0];

				//倒计时
				var time = $.now() + 72000 * 1000;
				$.cycle(function() {
					var diff = parseInt((time - $.now()) / 1000);
					var hh = to2Bit(parseInt(diff / 3600));
					var mm = to2Bit(parseInt((diff % 3600) / 60));
					var ss = to2Bit(diff % 60);
					model.h1 = hh.substring(0, 1);
					model.h2 = hh.substring(1);
					model.m1 = mm.substring(0, 1);
					model.m2 = mm.substring(1);
					model.s1 = ss.substring(0, 1);
					model.s2 = ss.substring(1);
					//更新指定变量到界面 //应用并更新界面,控制器处在可见的视口上才会触发
					scope.apply(["model.h1", "model.h2", "model.m1", "model.m2", "model.s1", "model.s2"]);
				}, 1000);

				scope.apply(); //应用并更新界面,控制器处在可见的视口上才会触发
			});
		},
		model2002112: function(scope) { //局部控制器
			getData(function(data) {
				var model = data.content.model2002112;
				scope.model = model;
				scope.list = model.itemList;
				scope.apply(); //应用并更新界面,控制器处在可见的视口上才会触发
			});
		},
		model2002115: function(scope) { //局部控制器
			getData(function(data) {
				var model = data.content.model2002115;
				scope.model = model;
				scope.list = model.itemList;
				scope.apply(); //应用并更新界面,控制器处在可见的视口上才会触发
			});
		},
		model2002123: function(scope) { //局部控制器
			getData(function(data) {
				var model = data.content.model2002123;
				scope.model = model;
				scope.list = model.itemList;
				scope.apply(); //应用并更新界面,控制器处在可见的视口上才会触发
			});
		},
		model2002116: function(scope) { //局部控制器
			getData(function(data) {
				var model = data.content.model2002116;
				scope.model = model;
				scope.list = model.itemList;
				scope.apply(); //应用并更新界面,控制器处在可见的视口上才会触发
			});
		},
		model2002110: function(scope) { //局部控制器
			getData(function(data) {
				var model = data.content.model2002110;
				scope.model = model;
				scope.list = model.itemList;
				scope.apply(); //应用并更新界面,控制器处在可见的视口上才会触发
			});
		}
	});

	function to2Bit(val) {
		return val < 10 ? "0" + val : "" + val
	}

	function getData(callback) {
		if (getData.data) {
			return callback && callback(getData.data);
		}
		$.use("data.js?" + $.now(), function(data) {
			getData.data = data;
			callback && callback(getData.data);
		})
	}

	function getRealWidth() {
		var width = window.innerWidth;
		width = Math.min(width, $("body").width());
		width = Math.max(320, width);
		width = Math.min(640, width);
		return width;
	}

	function getScale() {
		var realWidth = getRealWidth();
		var scale = realWidth / 320;
		return scale > 2 ? 2 : scale;
	}

	//if (!($.isIphone() || $.isWP() || $.isAndroid())) { //不是移动,就放大页面
		/*function scale() {
			var scal = getScale();
			$("#wrap").css($.cssPrefix({
				"transform": "scale(" + scal + "," + scal + ") translate(0, 0px)"
			}));
		}
		$(function() {
			scale();
		});
		$(window).on({
			resize: function(e) {
				scale();
			}
		});*/
	//}

})(Qmik);