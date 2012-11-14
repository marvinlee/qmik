/**
 * @author:leochen
 * @email:cwq0312@163.com
 * @version:1.0
 * 导航处理(利用hash的前进后退,支持刷新后的前进后退)
 */
(function($){
	var  doc=document,win=window,loc=location,sY=win.scrollY,execCount=0,prefix="$QmikHashHead:",
	tag=";",nav={
		put:function(hash){loc.hash=hash.replace(/;$/,"")+tag},
		get:function(){return loc.hash.replace(/^#|;$/g, "")}
	};
	function get(){
		var h=nav.get(),flag=$.decode(h.replace(/:.*/,"")),
		op=$.parseJSON($.decode(h.replace(/^.*:/,"")))||[],
		key=prefix+flag;
		return {flag:flag,fun:$(win).data(key),param:op}
	}	
	function hashchange(e){
		var o=get(),p=o.param||[],r;
		if($.likeNull(o.flag))return !0;
		$.each(p,function(i,v){
			if(v=="$QmikHashEvent")p[i]=e;
		});
		r=$.isFun(o.fun);
		if(r){
			o.fun.apply(o.fun,p);
			win.scroll(0,sY);
		}
		return r
	}
	function bind(){$(win).bind("hashchange",hashchange)}
	$(doc).ready(function(){
		function hc(){
			if(++execCount>36)return;
			if(!hashchange(doc.createEvent?doc.createEvent("MouseEvents"):null))$.delay(hc,200)
		}
		$.delay(hc,200)
	})
	$.extend({
		navHash:{
			change:function(flag,param,callback){
				$.isFun(callback)&&callback();
				sY=win.scrollY;
				var np=[],hash,key=prefix+flag;
				$.each($.isNull(param)?[]:$.isArray(param)?param:[param],function(i,v){
					if($.isEvent(v))v="$QmikHashEvent";
					try{v=$.stringify(v)}catch(e){v="$QmikLoseParam"}
					np.push($.encode(v))
				})
				hash=$.encode(flag)+":"+$.stringify(np);
				$(win).unbind("hashchange",hashchange,bind);
				nav.put(hash);
				setTimeout(bind,500);
			},
			register:function(flag,fun){
				var key=prefix+flag;
				if($.isFun(fun))$(win).data(key,fun);
			}
		}
	});
})(Qmik);