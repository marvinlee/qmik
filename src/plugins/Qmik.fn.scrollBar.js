(function(Q) {
    var gConfig = {
        height: window.innerHeight,
        width: 3,
        maxWidth:5,
        goX: 60, //滑动时,如果水平方向差值超过30,认为是水平滑动
        goY: 30, //滑动时,如果水平方向差值超过30,认为是水平滑动
        border : 8,//外边界,在边界内滑动生效,否则失效
        showScroll: true, //显示滚动条,
        mousewheel: 50,//鼠标滚轮滚动时,应该滑动的距离
        scrollBar: {
            bg: "rgba(0,0,0,0.5)"
        }
    };
    //class

    function caulateBar(qbar, me) {
        var barHeight = rate(me) * me.parent().height() - 36;
        qbar.css({
            height: barHeight
        });
    }

    function rate(me) {
        var viewHeight = me.parent().height();
        return viewHeight / (me.height() || 1);
    }
    var gCss=Q.extend({},Q.cssPrefix({
        "backface-visibility": "hidden"
    }));
    /**
     *滚动
     * @param conf{
     *     width:xxx,
     *     height:xxx,
     * }
     */
    function scroll(_config) {
        var conf = Q.extend({}, gConfig, _config);
        var me = this;
        var _parent = me.parent();
        var muid = "muid_" + parseInt(Math.random() * 100000);
        var mid = conf.mid || muid;
        var scroll = null;
        var bg = null ;
        var bar = null ;
        if (_parent.height() > window.innerHeight - 30) {
            _parent.css({
                height: (window.innerHeight - 30) + "px"
            });
        }
        _parent.css(gCss);
        me.each(function(i,dom){
            Q(dom).css(gCss);
        });
        ///////////////////
        if (conf.showScroll) {
            Q("div[map-selector='"+me.selector+"']",me.context).remove();
            _parent.append('<div map-selector="'+me.selector+'" class="c-q-scroll" mid="' + mid + '" muid="' + muid + '"><div class="c-q-bg"><div class="c-q-bar"></div></div></div>'); 
            
            scroll = Q("[muid=" + muid + "]", _parent);
            bg = Q(".c-q-bg", scroll);
            bar = Q(".c-q-bar", scroll);
            scroll.css({
                height: _parent.height() + "px",
                minWidth: "3px",
                width:conf.width+"px",
                maxWidth:conf.maxWidth+"px",
                border:"0",
                padding:"0",
                margin:"0",
                overflow:"hidden",
                position: "absolute",
                "top": "0",
                left: (me.position().left + me.width() - bg.width() - 1) + "px"
            });
            scroll.css(gCss);
            bg.css({
                minWidth: "3px",
                height: _parent.height() + "px"
            });
            bg.css(gCss);
            var radius= bg.width() / 2 + 1;
            bar.css({
                minWidth: "3px",
                background: "rgba(0,0,0,0.005)",
                borderRadius : radius + "px"
            });
            
            bar.css(gCss);
            Q(window).on({
                resize: function(e) {
                    scroll.css({
                        height: _parent.height() + "px"
                    });
                }
            });
            caulateBar(bar, me); //计算滚动条的高度
        }
        var thread;
        //显示滚动条
        function showBar() {
            thread && thread.stop();
            thread = Q.delay(function() {
                thread = null;
                bar.css({
                    "transition": "1000ms",
                    background: "rgba(0,0,0,0)"
                });
            }, 1200);
            bar.css({
                "transition": "1000ms",
                "background-color": conf.scrollBar.bg || "rgba(0,0,0,0.5)"
            });
        }        
        var direct;
        var oSite = {
            x: 0,
            y: 0
        };
        var oStart = {
            x: 0,
            y: 0,
            mX: 0,
            mY: 0
        };
        var oDiff = {
            x: 0,
            y: 0
        };
        var maxHeight = me.height();
        var viewHeight = _parent.height();
        var isMobile = Q.isWP() || Q.isAndroid() || Q.isIphone();
        //确定滑动方向,垂直=Y or 水平=X, 未确定=null

        function sureDirect(e) {
            if (e.touches) {
                var touch = e.touches ? e.touches[0] : e;
                oDiff.x = touch.clientX - oStart.x;
                if (Math.abs(oDiff.x) >= conf.goX) {
                    return "X"
                }
                oDiff.y = touch.clientY - oStart.y;
                if (Math.abs(oDiff.y) >= conf.goY) {
                    return "Y"
                }
            }else{
                return "Y";
            }
            return null;
        }

        //判断是否超出边界范围

        function isLimit(direction) {
            var bif = isMobile ? 100 : 10;
            switch (direction) {
                case 1: //方向向上
                    return Math.abs(oSite.y) - bif >= maxHeight - viewHeight + 10;
                case 2: //方向向下
                    return oSite.y >= bif;
            }
            return false
        }
        //是否是在边界触发

        function isBorderTrig() {
            return oStart.x < conf.border || (Q(window).width() - oStart.x < conf.border)
        }

        function caulateNewDiff(val){
            if(val < 10) return val;
        }

        function isScroll(e) {
            var canMove = false;
            if (e.touches) {
                var touch = e.touches ? e.touches[0] : e;
                oDiff.x = touch.clientX - oStart.mX;
                oDiff.y = touch.clientY - oStart.mY;
                oStart.mX = touch.clientX;
                oStart.mY = touch.clientY;

                if (!isLimit(oDiff.y > 0 ? 2 : 1)) {
                    oSite.x += oDiff.x;
                    oSite.y += oDiff.y;
                    canMove = true;
                } else {
                    canMove = false;
                }
            } else { //鼠标滚轮滚动
                oDiff.x = oDiff.y = conf.mousewheel;
                if (event.wheelDelta >= 120) { //向下
                    if (!isLimit(2)) {
                        oSite.x += oDiff.x;
                        oSite.y += oDiff.y;
                        oSite.x = oSite.x >= 0 ? 0 : oSite.x;
                        oSite.y = oSite.y >= 0 ? 0 : oSite.y;
                        canMove = true;
                    } else {
                        canMove = false;
                    }
                } else if (event.wheelDelta <= -120) { //向上
                    if (!isLimit(1)) {
                        oSite.x -= oDiff.x;
                        oSite.y -= oDiff.y;
                        canMove = true;
                    } else {
                        canMove = false;
                    }
                }
            }
            return canMove
        }

        function stop(e){
            e.preventDefault();
            e.stopPropagation();
        }

        function _start(e) {
            direct = null;
            var touch = e.touches ? e.touches[0] : e;
            oStart.mX = oStart.x = touch.clientX;
            oStart.mY = oStart.y = touch.clientY;
        }
        //滚动
        function _scroll(e) {
            maxHeight = me.height();
            viewHeight = _parent.height();
            //判断滑动方向确定没有
            if (Q.likeNull(direct)) {
                direct = sureDirect(e);
                return;
            }

            if (isBorderTrig()) {
                return;
            }

            //不支持横向滑动
            if (direct == "X") {
                return;
            }
            //有滑动方向,进来
            if (direct == "Y") {
                stop(e);
                if (!isScroll(e)) {
                    return;
                }
                scroll2Site(me, oSite.y, isMobile ? 100 : 1);
            }
        }

        function _end(e) {
            if (isBorderTrig()) {
                return;
            }
            if (direct == "Y") {
                stop(e);
                direct = null;
                if (oSite.y > 30) {
                    conf.update && conf.update(direct);
                    oSite.y = 0;
                    Q.delay(function() {
                        scroll2Site(me, 0, 500);
                    }, 100);
                } else if (oSite.y - 30 <= viewHeight - maxHeight) {
                    conf.update && conf.update(direct);
                    if( maxHeight <= viewHeight){
                        oSite.y = 0;
                        Q.delay(function() {
                            scroll2Site(me, 0, 500);
                        }, 100);
                        return;
                    }
                    oSite.y = viewHeight - maxHeight;
                    Q.delay(function() {
                        scroll2Site(me, oSite.y, 500);
                    }, 100);
                }
                return false;
            }
            direct = null;
        }

        function scroll2Site(me, site, gad) {
            gad = gad || 1;
            showBar();
            me.css(Q.cssPrefix({
                "transition": gad + "ms",
                "transform": "translateY(" + site + "px)"
            }));
            var scrollSite = -site * rate(me);
            bar.css(Q.cssPrefix({
                "transition": gad + "ms",
                "transform": "translateY(" + scrollSite + "px)"
            }));
        }
        ////////////////////////
        //取消绑定相关事件
        me.un("touchstart",me[0].__q_scrollbar_start);
        me.un("mouseover",me[0].__q_scrollbar_start);
        me.un("mousedown",me[0].__q_scrollbar_start);
        me.un("touchmove",me[0].__q_scrollbar_scroll);
        me.un("mousewheel",me[0].__q_scrollbar_scroll);
        me.un("touchend",me[0].__q_scrollbar_end);
        me.un("mouseup",me[0].__q_scrollbar_end);
        //如果没有绑定过事件,就绑定下
        me.on({
            "touchstart": _start,
            "mouseover": _start,
            "mousedown":_start,
            "touchmove": _scroll,
            "mousewheel": _scroll,
            "touchend": _end,
            "mouseup": _end
        }); 
        //
        me.attr("data-bindScrollBar","true");
        me[0].__q_scrollbar_start = _start;
        me[0].__q_scrollbar_scroll = _scroll;
        me[0].__q_scrollbar_end = _end;
    }

    Q.fn.scrollBar = scroll;
    Q.sun && Q.sun.define(function(require, exports, module) {
        module.exports = Q;
    });
})(Qmik);
