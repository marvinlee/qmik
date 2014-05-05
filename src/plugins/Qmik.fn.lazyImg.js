/**
 * 
 */
(function(Q) {
	var win = window;
	var lazyImg = {
		init: function(opt) {
			var me = this;
			me.img.init(opt);
		},
		img: {
			init: function(opt) {
				var that = this;
				function getHeight(){
					return win.innerHeight || screen.availHeight;
				}
				function inViewport(el) {
					var height = getHeight();
					var min = window.pageYOffset - height/2;
					var max = getMax();
					min = min<0?0:min;
					var elTop = Q(el).offset().top;
					return elTop > 0 && Q(el).height()>0 && elTop >= min && elTop <= max;
				}
				function getMax(){
					return window.pageYOffset + getHeight() * 1.2;
				}
				var loadIndex = 0;
				Q(win).bind('scroll', function() {
					var oldIndex = loadIndex;
					loadIndex++;
					//var lazys = Q('img.lazy');
					var lazys = document.querySelectorAll('img.lazy');
					for (var i = 0; i < lazys.length; i++) {
						if(oldIndex + 1 != loadIndex ){
							break;
						}
						var node = lazys[i];
						var Qme = Q(node);
						if(Qme.offset().top > getMax()){
							break;
						}
						if (inViewport(Qme)) {
							var opacity = parseFloat(Qme.css("opacity"))||0;
							opacity <= 0 ? Qme.css("opacity","0.5") : Qme.attr("_opacity",true);
							load(Qme);
						}
					}
				}).trigger('scroll');

				function load(_self) {
					if (_self.attr('loaded')) return;
					var img = new Image(),
						url = _self.attr('_src')||_self.attr('dataimg');
					img.onload = function() {
						_self.attr('src', url).removeClass('lazy');
						var opacity = 1;
						if(_self.attr("_opacity")){
							opacity = _self.css("opacity");
						}
						_self.css({
							"transition":"360ms",
							"opacity": opacity
						});
					}
					url && (img.src = url);
					_self.attr('loaded', true);
				}
			}
		}
	};
	lazyImg.version = 1.1;
	Q.isQmik && Q.sun.define(function(require,exports,module){
		module.exports = lazyImg;
	});
	setTimeout(function(){
		Q(win).trigger("scroll");
	},2000);
	//////////////////////////////////////////////////////////////////////////////////////////////
	win.lazyload = lazyload;
})($);