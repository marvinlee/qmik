/**
 * lrc歌词解析
 * @author:leochen
 * @email:cwq0312@163.com
 * @version:1.0
 */
(function($){
	var doc=document,id="$QmikAudio",conf={controls:false,preload:false,id:id},win=window,
	list={},CM,
	media=function(ope,config){
		if(ope){
			var M=doc.createElement("audio");
			$.extend(M,conf,config)
			$(M).bind("about",$.audio.about);
			$(M).bind("error", $.audio.error);
			$(M).bind("timeupdate", $.audio.timeupdate);
			$(M).bind("ended", $.audio.ended);
			CM=M;
		}
		return CM
	};
	$.extend({
		vedio:function(mode,update){
			var m=this;
			m.mode=mode;
			$.extend(m,{
			play:function(obj,fun){
				var M=media();
				if(obj){
					
				}else{
					M&&M.play()
				}
				fun&&fun(M);
			},
			stop:function(fun){
				var M=media();
				if(M){
					M.currentTime=0;
					M.pause();
				}
				fun&&fun(M);
			},
			pause:function(fun){
				var M=media();
				M&&M.pause();
				fun&&fun(M);
			},
			repeat:function(){//单曲循环
				
			},
			listCycle:function(){//列表循环
				
			},
			next:function(){//play next
				
			},
			prev:function(){//play prev
				
			},
			random:function(){//play random
				switch(mode){
				case 1:next();break;
				case 2:prev();break;
				case 4:
				default:random();break;
				}
			},
			timeupdate:function(e){
				update&&update(currentTime,duration);
			},
			seekable:function(time){//调整进度
				
			},
			add:function(obj){//add to list
				
			},
			ended:function(e){
				
			},
			about:function(){
				
			},
			error:function(){
				
			}
			})
		}
	})
})(Qmik);