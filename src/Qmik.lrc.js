/**
 * lrc歌词解析和滚动显示
 * @author:leochen
 * @email:cwq0312@163.com
 * @version:1.0
 */
(function($){
	var reg=/(\[[\d]{1,2}:[\d]{1,2}([.][\d]{1,2})?\]){1,}/,mtop=0,idLrc="QmikLrcContent",csLrc="QmikCSLrcWord";
	function getTime(str){//格式化时间
		var s=str.split(/:|[.]/);
		return parseInt(s[0]||0)*60+parseInt(s[1]||0)+parseInt(s[2]||0)/1000;
	}
	function sort(lrc){//按播放时间做从小到大的排序
		for(var t,j,i=0;i<lrc.length-1;i++){
			for(j=i+1;j<lrc.length;j++){
				if(lrc[i].time>lrc[j].time){
					t=lrc[i];lrc[i]=lrc[j];lrc[j]=t;
				}
			}
		}
		return lrc
	}
	$.extend({
		lrc:{
			resolve:function(txt){//解析lrc文本字符串,返回 [0:{time,text:"",target:0},1:{time:11,text:"",target:1}]
				if(!txt)return;
				var res=txt.replace(/\r/g,"\n").replace(/[\n]+/g,"\n").split("\n"),i=0,lrc=[],r=[],idx=0,last;
				for(;i<res.length;i++){
					var t=res[i],time=reg.exec(t),o={},ts=[],tss,j;
					if(time){
						tss=time[0].replace(/\[/g,"").split("]")||[];
						o.text=t.replace(time[0],"");
						if(o.text!=""||i>=res.length-3){
							for(j=tss.length-1;j>=0;j--)if(tss[j]!="")ts.push(getTime(tss[j]));
							o.ts=ts;
							lrc.push(o)
						}
					}
				}
				for(idx=i=0;i<lrc.length;i++){
					var ts=lrc[i].ts;
					for(var j=0;j<ts.length;j++){
						r.push({time:ts[j],target:idx++,text:lrc[i].text});
					}
				}
				r.push({time:0,text:"",target:-1});
				r=sort(r);last=r[r.length-1];
				r.push({time:last.time+1,text:"",target:r.length});
				return r
			},
			show:function(target,playTime,lrc,conf){//target:要显示到的目标对象,playTime:当前播放到歌曲的时间,lrc:$.lrc.resolve(text)解析后返回的对象,conf:配置:(start:开始滚动,end:结束滚动,mode:滚动模式,diff:差)
				if(!lrc)return;conf=conf||{};
				var tar=$(target),i=0,lm=$("#"+idLrc)[0],mode=conf.mode||"margin",start=conf.start||120,end=conf.end||160,diff=conf.diff||120;
				if(!lm){
					//生成界面
					var h=[],txt;
					h.push("<div id='"+idLrc+"' class='"+csLrc+"'>")
					for(;i<lrc.length;i++){
						txt=lrc[i].text||"&nbsp;";
						h.push("<p id='lrcRow"+lrc[i].target+"' index="+lrc[i].target+">"+txt+"</p>");
					}
					h.push("</div>");
					tar.html(h.join(""));
					tar.css("overflow-y","auto");
				}else{
					//行级显示播放到哪一行
					var ltar;
					for(var i=0;i<lrc.length-1;i++){
						if(playTime>=lrc[i].time&&playTime<lrc[i+1].time){
							ltar=$("#lrcRow"+lrc[i].target)[0];
							mtop=(lrc[i].target)*(ltar.offsetHeight-1)*2;
							if(ltar.className.indexOf("lrcCur")==-1){
								var tt=$.isQmik(target)?target[0]:target;
								if(mtop>start&&(lm.offsetHeight-mtop>end))tt.scrollTop=mtop-diff+60;
								else if(mtop<=0)tt.scrollTop=mtop;
								$(".lrcCur",tar[0]).removeClass("lrcCur");
								$("#lrcRow"+lrc[i].target).addClass("lrcCur");
							}
							break;
						}
					}
				}				
			}
		}
	})
})(Qmik);