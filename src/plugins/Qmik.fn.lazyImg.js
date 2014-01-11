/**
 * 图片懒加载
 */
(function(Q) {
	var win = window;
	//是否在视口位置中
	function inViewport(dom) {
		var min = win.pageYOffset - Q(dom).height() * 2;
		var max = win.pageYOffset + win.innerHeight;
		var _top = Q(dom).offset().top;
		return _top >= min && _top <= max;
	}

	function bindEvent() {
		var loadIndex = 0;
		Q(win).on({
			"scroll": function() {
				var oldIndex = loadIndex;
				loadIndex++;
				var lazys = Q('img.lazy');
				for (var i = 0; i < lazys.length; i++) {
					if (oldIndex + 1 != loadIndex) {
						break;
					}
					var node = lazys[i];
					var Qme = Q(node);
					if (inViewport(Qme)) {
						load(Qme);
					}
				}
			}
		}).trigger("scroll");
		Q.cycle(function(){
			Q(win).trigger("scroll");
		},1000,3000);
	}

	function load(me) {
		if (me.attr('loaded')) return;
		var src = me.attr('_src');
		if (src) {
			var img = new Image();
			img.onload = function() {
				me.attr('src', src).removeClass('lazy');
				me.css({
					"transition": "360ms",
					"opacity": "1"
				});
			}
			img.src = src;
			me.attr('loaded', true);
		}
	}

	function lazyImg(opt) {
		Q('img.lazy').css("opacity", "0.8");
		bindEvent();
	}
	Q.fn.lazyImg = lazyImg;
	Q.sun.define(function(require, exports, module) {
		module.exports = Q;
	});
})($);